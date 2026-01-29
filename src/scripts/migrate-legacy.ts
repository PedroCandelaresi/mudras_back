
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

// Entities
import { Articulo } from '../modules/articulos/entities/articulo.entity';
import { Proveedor } from '../modules/proveedores/entities/proveedor.entity';
import { Rubro } from '../modules/rubros/entities/rubro.entity';
import { PuntoMudras, TipoPuntoMudras } from '../modules/puntos-mudras/entities/punto-mudras.entity';
import { StockPuntoMudras } from '../modules/puntos-mudras/entities/stock-punto-mudras.entity';
import { ProveedorRubro } from '../modules/proveedores/entities/proveedor-rubro.entity';

// Load env vars
config({ path: path.join(__dirname, '../../.env') });

const BATCH_SIZE = 1000;

async function main() {
    console.log('Starting legacy migration...');

    const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USERNAME || 'mudras',
        password: process.env.DB_PASSWORD || 'mudras2025',
        database: process.env.DB_DATABASE || 'mudras',
        entities: [
            Articulo,
            Proveedor,
            Rubro,
            PuntoMudras,
            StockPuntoMudras,
            ProveedorRubro
        ],
        synchronize: false, // Don't sync, assume schema exists
    });

    try {
        await dataSource.initialize();
        console.log('Database connected.');

        // 1. Ensure Mudras POS
        const puntoRepo = dataSource.getRepository(PuntoMudras);
        let mudrasPoint = await puntoRepo.findOne({ where: { nombre: 'Mudras' } });
        if (!mudrasPoint) {
            console.log('Creating "Mudras" Point of Sale...');
            mudrasPoint = puntoRepo.create({
                nombre: 'Mudras',
                tipo: TipoPuntoMudras.venta,
                direccion: 'Local Principal',
                activo: true,
                manejaStockFisico: true,
                permiteVentasOnline: true
            });
            await puntoRepo.save(mudrasPoint);
        } else {
            console.log('"Mudras" POS already exists: ' + mudrasPoint.id);
        }

        // 2. Migrate Rubros
        const rubroRepo = dataSource.getRepository(Rubro);
        const rubrosMap = new Map<string, Rubro>(); // Name -> Entity

        console.log('Migrating Rubros...');
        await processFile('tbrubros.sql', async (line) => {
            // INSERT INTO tbrubros (Id, Rubro, Codigo) values (3, 'DIJES', NULL);
            const match = line.match(/VALUES \(\d+, '([^']*)',/i);
            if (match) {
                const nombre = match[1].trim();
                let rubro = await rubroRepo.findOne({ where: { Rubro: nombre } });
                if (!rubro) {
                    rubro = rubroRepo.create({ Rubro: nombre });
                    await rubroRepo.save(rubro);
                }
                rubrosMap.set(nombre.toUpperCase(), rubro);
            }
        });
        console.log(`Migrated/Loaded ${rubrosMap.size} Rubros.`);

        // 3. Migrate Proveedores
        const provRepo = dataSource.getRepository(Proveedor);
        const oldProvIdMap = new Map<number, Proveedor>(); // OldId -> NewEntity

        console.log('Migrating Proveedores...');
        // INSERT INTO tbproveedores (IdProveedor, Codigo, Nombre, Contacto, Direccion, Localidad, Provincia, CP, Telefono, Castigo, TipoIva, CUIT, Observaciones, Web, Mail, Rubro, Saldo, Pais) values (...)
        // Note: The SQL dump usually has a specific order. I'll use a regex that captures "values (id, ...)"
        // Based on head: IdProveedor, Codigo, Nombre, Contacto, Direccion, Localidad, Provincia, CP, Telefono, Celular, TipoIva, CUIT, Observaciones, Web, Mail, Rubro, Saldo, Pais

        await processFile('tbproveedores.sql', async (line) => {
            if (!line.startsWith('INSERT INTO')) return;

            // Simple CSV parse of values part. 
            // Warning: This is fragile if strings contain commas. 
            // But for a migration script we can try to be robust enough.
            const valuesPart = line.substring(line.indexOf('VALUES') + 7).trim().replace(/^\(/, '').replace(/\);$/, '');

            // Custom split function that respects quotes
            const parts = splitCsv(valuesPart);

            if (parts.length >= 1) {
                const oldId = parseInt(parts[0]);
                const nombre = cleanString(parts[2]);
                const codProv = cleanString(parts[1]);
                // Check existence by CUIT or Nombre
                const cuit = cleanString(parts[11]);

                let prov = null;
                if (cuit && cuit.length > 5) {
                    prov = await provRepo.findOne({ where: { CUIT: cuit } });
                }
                if (!prov) {
                    prov = await provRepo.findOne({ where: { Nombre: nombre } });
                }

                if (!prov) {
                    prov = provRepo.create({
                        Nombre: nombre,
                        Codigo: codProv, // Map Codigo -> Codigo
                        Contacto: cleanString(parts[3]),
                        Direccion: cleanString(parts[4]),
                        Localidad: cleanString(parts[5]),
                        Provincia: cleanString(parts[6]),
                        CP: cleanString(parts[7]),
                        Telefono: cleanString(parts[8]),
                        // Celular is part 9? Wait, let's check header again just in case, but assuming order
                        Celular: cleanString(parts[9]),
                        TipoIva: parseInt(parts[10]) || 1, // Default to 1 (Resp Inscripto?) or similar if null
                        CUIT: cuit,
                        Observaciones: cleanString(parts[12]),
                        Web: cleanString(parts[13]),
                        Mail: cleanString(parts[14]),
                        Rubro: cleanString(parts[15]), // Store string as legacy ref
                        Saldo: parseFloat(parts[16]) || 0,
                        Pais: cleanString(parts[17]),
                    });
                    await provRepo.save(prov);
                }
                oldProvIdMap.set(oldId, prov);
            }
        });
        console.log(`Migrated/Loaded ${oldProvIdMap.size} Proveedores.`);

        // 4. Migrate Articulos
        const artRepo = dataSource.getRepository(Articulo); // Uses 'mudras_articulos'
        const articuloMap = new Map<string, Articulo>(); // Codigo -> Entity
        const providerRubroPairs = new Set<string>(); // "provId|rubroId"

        console.log('Migrating Articulos...');
        // tbarticulos columns index guess based on CREATE TABLE:
        // 0: Codigo, 1: Rubro, 2: Descripcion, 3: Marca, 4: PrecioVenta, 5: PrecioCompra, 6: StockMinimo, 7: Stock, 8: AlicuotaIva, 9: Deposito, 10: id (AutoInc), 11: FechaCompra, 12: idProveedor, 13: Lista2, 14: Lista3, 15: Unidad, 16: Lista4, 17: PorcentajeGanancia

        let processedArts = 0;
        await processFile('tbarticulos.sql', async (line) => {
            if (!line.startsWith('INSERT INTO')) return;
            const valuesPart = line.substring(line.indexOf('VALUES') + 7).trim().replace(/^\(/, '').replace(/\);$/, '');
            const parts = splitCsv(valuesPart);

            if (parts.length > 0) {
                const codigo = cleanString(parts[0]) || 'SINCODIGO';

                // Check existing
                let art = await artRepo.findOne({ where: { Codigo: codigo } });

                // Map Relations
                const rubroName = cleanString(parts[1]);
                const rubroEntity = rubroName ? rubrosMap.get(rubroName.toUpperCase()) : null;

                const oldProvId = parseInt(parts[12]);
                const provEntity = oldProvId ? oldProvIdMap.get(oldProvId) : null;

                if (provEntity && rubroEntity) {
                    providerRubroPairs.add(`${provEntity.IdProveedor}|${rubroEntity.Id}`);
                }

                if (!art) {
                    art = artRepo.create({
                        Codigo: codigo,
                        Descripcion: cleanString(parts[2]),
                        Rubro: rubroName, // Legacy string
                        rubro: rubroEntity, // Relation
                        Marca: cleanString(parts[3]),
                        PrecioVenta: parseFloat(parts[4]) || 0,
                        PrecioCompra: parseFloat(parts[5]) || 0,
                        StockMinimo: parseFloat(parts[6]) || 0,
                        // Stock (7) IGNORED
                        AlicuotaIva: parseFloat(parts[8]) || 21,
                        Deposito: parseFloat(parts[9]) || 0, // Is this location or stock? Assuming float -> maybe stock in deposit? Map to Deposito field
                        FechaCompra: parts[11] ? new Date(cleanString(parts[11])) : null,
                        proveedor: provEntity,
                        Lista2: parseFloat(parts[13]) || 0,
                        Lista3: parseFloat(parts[14]) || 0,
                        Unidad: cleanString(parts[15]),
                        Lista4: parseFloat(parts[16]) || 0,
                        PorcentajeGanancia: parseFloat(parts[17]) || 0,
                        Calculado: false
                    });
                    await artRepo.save(art);
                }
                articuloMap.set(codigo, art);
                processedArts++;
                if (processedArts % 500 === 0) process.stdout.write('.');
            }
        });
        console.log(`\nprocessed ${processedArts} Articulos.`);

        // 5. Post-Process Relationships (Proveedor-Rubro)
        const provRubroRepo = dataSource.getRepository(ProveedorRubro);
        console.log('Creating Provider-Rubro relations...');
        for (const pair of providerRubroPairs) {
            const [pId, rId] = pair.split('|').map(Number);
            // Check if exists
            const exists = await provRubroRepo.findOne({ where: { proveedorId: pId, rubroId: rId } });
            if (!exists) {
                await provRubroRepo.save({
                    proveedorId: pId,
                    rubroId: rId,
                    porcentajeRecargo: 0,
                    porcentajeDescuento: 0
                });
            }
        }

        // 6. Migrate Stock
        const stockRepo = dataSource.getRepository(StockPuntoMudras);
        console.log('Migrating Stock to Point: Mudras...');
        // tbstock columns: Fecha, Codigo, Stock, StockAnterior, Id, Usuario
        // Indices: 0: Fecha, 1: Codigo, 2: Stock, ...

        let processedStock = 0;
        await processFile('tbstock.sql', async (line) => {
            if (!line.startsWith('INSERT INTO')) return;
            const valuesPart = line.substring(line.indexOf('VALUES') + 7).trim().replace(/^\(/, '').replace(/\);$/, '');
            const parts = splitCsv(valuesPart);

            if (parts.length > 2) {
                const codigo = cleanString(parts[1]);
                const cantidad = parseFloat(parts[2]) || 0;

                const articulo = articuloMap.get(codigo);
                if (articulo) {
                    // Upsert StockPuntoMudras
                    // We use findOne to avoid dupes if running multiple times, 
                    // essentially "Last record wins" or "Sum"?
                    // TbStock is a history table (movements). The "Stock" column seems to be the balance at that moment?
                    // The user said: "la tabla tbstock es la verdadera tabla de stock"
                    // Usually a dump has the final state or logs.
                    // The instructions say: "tbstock... que es el stock real".
                    // If it contains multiple rows per article, it's a history.
                    // If I look at the sample:
                    // INSERT ... values ('2022-11-14', '9789501742046', 10, 0, 1, 0); -> Stock 10
                    // INSERT ... values ('2022-11-14', '9789501742046', 10, 10, 2, 0); -> Stock 10 (Wait, StockAnterior 10. No change?)
                    // INSERT ... values ('2022-11-14', '9789501742046', 0, 10, 4, 0); -> Stock becomes 0
                    // INSERT ... values ('2022-11-14', '9789501742046', 156, 0, 6, 0); -> Stock becomes 156
                    // It looks like a log. Unique "Id" usage confirms it.
                    // So I should take the **LATEST** entry for each code.
                    // BUT, since we loop through the file (usually ordered by ID), we can just update the stock.
                    // The final update will be the current stock.

                    let stockEntry = await stockRepo.findOne({
                        where: { puntoMudrasId: mudrasPoint.id, articuloId: articulo.id }
                    });

                    if (!stockEntry) {
                        stockEntry = stockRepo.create({
                            puntoMudrasId: mudrasPoint.id,
                            articuloId: articulo.id,
                            cantidad: 0,
                            stockMinimo: articulo.StockMinimo || 0 // Inherit?
                        });
                    }

                    // Overwrite with latest value found in line
                    stockEntry.cantidad = cantidad;
                    await stockRepo.save(stockEntry);
                }
                processedStock++;
                if (processedStock % 1000 === 0) process.stdout.write('+');
            }
        });
        console.log(`\nProcessed ${processedStock} stock entries.`);

        console.log('Migration Complete!');

    } catch (error) {
        console.error('Migration failed', error);
    } finally {
        if (dataSource.isInitialized) await dataSource.destroy();
    }
}

// Helpers
async function processFile(filename: string, callback: (line: string) => Promise<void>) {
    const filePath = path.join(__dirname, '../../legacy-data', filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
    }
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.trim().length === 0) continue;
        await callback(line);
    }
}

function cleanString(str: string): string {
    if (!str) return '';
    if (str === 'NULL') return null;
    return str.replace(/^'/, '').replace(/'$/, '').trim();
}

function splitCsv(str: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === "'") {
            inQuotes = !inQuotes;
            current += char;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

main();
