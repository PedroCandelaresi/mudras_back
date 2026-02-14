
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
import { Marca } from '../modules/marcas/entities/marca.entity';
// Missing Referenced Entities
import { CuentaCorriente } from '../modules/cuentas-corrientes/entities/cuenta-corriente.entity';
import { OrdenCompra } from '../modules/compras/entities/orden-compra.entity';
import { MovimientoStock } from '../modules/stock/entities/movimiento-stock.entity';
import { MovimientoStockPunto } from '../modules/puntos-mudras/entities/movimiento-stock-punto.entity';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { Cliente } from '../modules/clientes/entities/cliente.entity';
import { DetalleOrdenCompra } from '../modules/compras/entities/detalle-orden-compra.entity';
import { MovimientoCuentaCorriente } from '../modules/cuentas-corrientes/entities/movimiento-cuenta-corriente.entity';
import { AsientoContable } from '../modules/contabilidad/entities/asiento-contable.entity';
import { DetalleAsientoContable } from '../modules/contabilidad/entities/detalle-asiento-contable.entity';
import { CuentaContable } from '../modules/contabilidad/entities/cuenta-contable.entity';
import { Venta } from '../modules/ventas/entities/venta.entity';
import { DetalleVenta } from '../modules/ventas/entities/detalle-venta.entity';
import { Promocion } from '../modules/promociones/entities/promocion.entity';
import { UserAuth } from '../modules/users-auth/entities/user.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { RolePermission } from '../modules/roles/entities/role-permission.entity';
import { UserRole } from '../modules/users-auth/entities/user-role.entity';
import { UserProvider } from '../modules/users-auth/entities/user-provider.entity';
import { RefreshToken } from '../modules/users-auth/entities/refresh-token.entity';
import { VentaCaja } from '../modules/caja-registradora/entities/venta-caja.entity';
import { DetalleVentaCaja } from '../modules/caja-registradora/entities/detalle-venta-caja.entity';
import { PagoCaja } from '../modules/caja-registradora/entities/pago-caja.entity';
import { ComprobanteAfip } from '../modules/caja-registradora/entities/comprobante-afip.entity';
import { MovimientoInventario } from '../modules/caja-registradora/entities/movimiento-inventario.entity';
import { SnapshotInventarioMensual } from '../modules/caja-registradora/entities/snapshot-inventario.entity';
import { Stock } from '../modules/stock/entities/stock.entity';
import { Gasto } from '../modules/gastos/entities/gasto.entity';
import { CategoriaGasto } from '../modules/gastos/entities/categoria-gasto.entity';
import { UsuarioAuthMap } from '../modules/users-auth/entities/usuario-auth-map.entity';

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
            Stock,
            Rubro,
            Usuario,
            Cliente,
            CuentaCorriente,
            MovimientoCuentaCorriente,
            AsientoContable,
            DetalleAsientoContable,
            CuentaContable,
            Venta,
            DetalleVenta,
            Promocion,
            MovimientoStock,
            // RBAC entities
            UserAuth,
            Role,
            Permission,
            RolePermission,
            UserRole,
            UserProvider,
            RefreshToken,
            // Caja Registradora entities
            VentaCaja,
            DetalleVentaCaja,
            PagoCaja,
            ComprobanteAfip,
            MovimientoInventario,
            SnapshotInventarioMensual,
            // Puntos Mudras entities
            PuntoMudras,
            StockPuntoMudras,
            MovimientoStockPunto,
            // Compras
            OrdenCompra,
            DetalleOrdenCompra,
            Gasto,
            CategoriaGasto,
            ProveedorRubro,
            UsuarioAuthMap,
            Marca,
        ],
        synchronize: true, // Sync schema to ensure tables exist
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



        // 2. Migrate Marcas (New)
        const marcaRepo = dataSource.getRepository(Marca);
        console.log('Migrating Marcas...');
        await processFile('tbmarcas.sql', async (line) => {
            // INSERT INTO tbmarcas (Descripcion, Id) values ('EDIS BUSCARONS', 2);
            // Note: tbmarcas.sql order might vary, checking values
            // INSERT INTO tbmarcas (Descripcion, Id) values ...
            const valuesMatch = line.match(/values\s*\((.+)\);?$/i);
            if (valuesMatch) {
                const valuesPart = valuesMatch[1].trim();
                const parts = splitCsv(valuesPart);
                // Based on header: Descripcion, Id
                // But values in sample: ('EDIS BUSCARONS', 2) -> 0: Descripcion, 1: Id
                if (parts.length >= 2) {
                    const desc = cleanString(parts[0]);
                    const id = parseInt(parts[1]);

                    if (desc && id) {
                        let marca = await marcaRepo.findOne({ where: { id: id } });
                        if (!marca) {
                            marca = marcaRepo.create({
                                id: id,
                                Descripcion: desc
                            });
                            await marcaRepo.save(marca);
                        }
                    }
                }
            }
        });
        console.log('Migrated Marcas.');

        // 3. Migrate Rubros
        const rubroRepo = dataSource.getRepository(Rubro);
        const rubrosMap = new Map<string, Rubro>(); // Name -> Entity

        console.log('Migrating Rubros...');
        await processFile('tbrubros.sql', async (line) => {
            // INSERT INTO tbrubros (Id, Rubro, Codigo) values (3, 'DIJES', NULL);
            const match = line.match(/values \(\d+, '([^']*)',/i);
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

        await processFile('tbproveedores.sql', async (line) => {
            if (!line.match(/INSERT INTO/i)) return;

            // Robust extract 'VALUES (...)' or 'values (...)'
            const valuesMatch = line.match(/values\s*\((.+)\);?$/i);
            if (!valuesMatch) return;

            const valuesPart = valuesMatch[1].trim();

            // Custom split function that respects quotes
            const parts = splitCsv(valuesPart);

            if (parts.length >= 1) {
                const oldId = parseInt(parts[0]);
                const nombre = cleanString(parts[2]);
                const codProv = cleanString(parts[1]);
                // ... rest of logic stays same (index-based)
                // BUT indices might shift if logic changed? No, splitCsv is same.
                // Indices are based on `valuesPart` containing the CSV content inside parens.

                // Parts are: 0:Id, 1:Codigo, 2:Nombre, ...

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
                        Celular: cleanString(parts[9]),
                        TipoIva: parseInt(parts[10]) || 1,
                        CUIT: cuit,
                        Observaciones: cleanString(parts[12]),
                        Web: cleanString(parts[13]),
                        Mail: cleanString(parts[14]),
                        Rubro: cleanString(parts[15]),
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
        const artRepo = dataSource.getRepository(Articulo);
        const articuloMap = new Map<string, Articulo>();
        const providerRubroPairs = new Set<string>();

        console.log('Migrating Articulos...');
        // tbarticulos columns index guess based on CREATE TABLE:
        // 0: Codigo, 1: Rubro, 2: Descripcion, 3: Marca ... (from values)
        // Wait, the INSERT statement shown has columns EXPLICITLY listed. I must check order.
        // INSERT INTO tbarticulos (Codigo, Rubro, Descripcion, Marca, PrecioVenta, PrecioCompra, StockMinimo, Stock, AlicuotaIva, Deposito, id, FechaCompra, idProveedor, Lista2, Lista3, Unidad, Lista4, PorcentajeGanancia, Calculado, CodigoProv, CostoPromedio, CostoEnDolares, FechaModif, PrecioListaProveedor, StockInicial, Ubicacion, Lista1EnDolares, Dto1, Dto2, Dto3, Impuesto, EnPromocion, UsaTalle, Compuesto, Combustible, ImpuestoPorcentual) values ...
        // Index mapping:
        // 0: Codigo
        // 1: Rubro
        // 2: Descripcion
        // 3: Marca
        // 4: PrecioVenta
        // 5: PrecioCompra
        // 6: StockMinimo
        // 7: Stock
        // 8: AlicuotaIva
        // 9: Deposito
        // 10: id
        // 11: FechaCompra
        // 12: idProveedor
        // 13: Lista2
        // 14: Lista3
        // 15: Unidad
        // 16: Lista4
        // 17: PorcentajeGanancia
        // THIS MATCHES MY PREVIOUS ASSUMPTION.

        let processedArts = 0;
        await processFile('tbarticulos.sql', async (line) => {
            if (!line.match(/INSERT INTO/i)) return;

            // Robust parsing
            const valuesMatch = line.match(/values\s*\((.+)\);?$/i);
            if (!valuesMatch) return;

            const valuesPart = valuesMatch[1].trim();
            const parts = splitCsv(valuesPart);

            if (parts.length > 0) {
                const codigo = cleanString(parts[0]);
                if (!codigo) return; // Skip invalid lines

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
                    art = artRepo.create({ Codigo: codigo });
                }

                // Update fields (Upsert logic to fix missing fields or encoding)
                art.Descripcion = cleanString(parts[2]);
                art.Rubro = rubroName;
                art.rubro = rubroEntity;
                art.Marca = cleanString(parts[3]);
                art.PrecioVenta = parseFloat(parts[4]) || 0;
                art.PrecioCompra = parseFloat(parts[5]) || 0;
                art.StockMinimo = parseFloat(parts[6]) || 0;
                // Stock (7) IGNORED
                const rawIva = cleanString(parts[8]);
                const parsedIva = rawIva ? parseFloat(rawIva.replace(',', '.')) : NaN;
                art.AlicuotaIva = !isNaN(parsedIva) ? parsedIva : 21;
                art.Deposito = parseFloat(parts[9]) || 0;
                art.FechaCompra = parts[11] ? new Date(cleanString(parts[11])) : null;
                art.proveedor = provEntity;
                art.Lista2 = parseFloat(parts[13]) || 0;
                art.Lista3 = parseFloat(parts[14]) || 0;
                art.Unidad = cleanString(parts[15]);
                art.Lista4 = parseFloat(parts[16]) || 0;
                art.PorcentajeGanancia = parseFloat(parts[17]) || 0;
                art.Calculado = false; // logic default

                await artRepo.save(art);
                articuloMap.set(codigo, art);

                // Create Stock Entry directly from tbarticulos
                const stockQty = parseFloat(parts[7]) || 0;

                // Ensure stock entry exists/is updated
                let stockEntry = await dataSource.getRepository(StockPuntoMudras).findOne({
                    where: { puntoMudrasId: mudrasPoint.id, articuloId: art.id }
                });

                if (!stockEntry) {
                    stockEntry = dataSource.getRepository(StockPuntoMudras).create({
                        puntoMudrasId: mudrasPoint.id,
                        articuloId: art.id,
                        cantidad: stockQty,
                        stockMinimo: art.StockMinimo || 0
                    });
                } else {
                    stockEntry.cantidad = stockQty;
                    stockEntry.stockMinimo = art.StockMinimo || 0;
                }
                await dataSource.getRepository(StockPuntoMudras).save(stockEntry);

                processedArts++;
                if (processedArts % 500 === 0) process.stdout.write('.');
            }
        });
        console.log(`\nprocessed ${processedArts} Articulos and Stock entries.`);

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

        // 6. Migrate Stock - REMOVED (Now integrated into Articulos)
        console.log('Stock migration integrated into Articulos processing.');



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
    const fileStream = fs.createReadStream(filePath, { encoding: 'latin1' });
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
