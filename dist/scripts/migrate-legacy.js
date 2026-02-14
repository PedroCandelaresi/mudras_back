"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const fs = require("fs");
const readline = require("readline");
const path = require("path");
const articulo_entity_1 = require("../modules/articulos/entities/articulo.entity");
const proveedor_entity_1 = require("../modules/proveedores/entities/proveedor.entity");
const rubro_entity_1 = require("../modules/rubros/entities/rubro.entity");
const punto_mudras_entity_1 = require("../modules/puntos-mudras/entities/punto-mudras.entity");
const stock_punto_mudras_entity_1 = require("../modules/puntos-mudras/entities/stock-punto-mudras.entity");
const proveedor_rubro_entity_1 = require("../modules/proveedores/entities/proveedor-rubro.entity");
const marca_entity_1 = require("../modules/marcas/entities/marca.entity");
const cuenta_corriente_entity_1 = require("../modules/cuentas-corrientes/entities/cuenta-corriente.entity");
const orden_compra_entity_1 = require("../modules/compras/entities/orden-compra.entity");
const movimiento_stock_entity_1 = require("../modules/stock/entities/movimiento-stock.entity");
const movimiento_stock_punto_entity_1 = require("../modules/puntos-mudras/entities/movimiento-stock-punto.entity");
const usuario_entity_1 = require("../modules/usuarios/entities/usuario.entity");
const cliente_entity_1 = require("../modules/clientes/entities/cliente.entity");
const detalle_orden_compra_entity_1 = require("../modules/compras/entities/detalle-orden-compra.entity");
const movimiento_cuenta_corriente_entity_1 = require("../modules/cuentas-corrientes/entities/movimiento-cuenta-corriente.entity");
const asiento_contable_entity_1 = require("../modules/contabilidad/entities/asiento-contable.entity");
const detalle_asiento_contable_entity_1 = require("../modules/contabilidad/entities/detalle-asiento-contable.entity");
const cuenta_contable_entity_1 = require("../modules/contabilidad/entities/cuenta-contable.entity");
const venta_entity_1 = require("../modules/ventas/entities/venta.entity");
const detalle_venta_entity_1 = require("../modules/ventas/entities/detalle-venta.entity");
const promocion_entity_1 = require("../modules/promociones/entities/promocion.entity");
const user_entity_1 = require("../modules/users-auth/entities/user.entity");
const role_entity_1 = require("../modules/roles/entities/role.entity");
const permission_entity_1 = require("../modules/permissions/entities/permission.entity");
const role_permission_entity_1 = require("../modules/roles/entities/role-permission.entity");
const user_role_entity_1 = require("../modules/users-auth/entities/user-role.entity");
const user_provider_entity_1 = require("../modules/users-auth/entities/user-provider.entity");
const refresh_token_entity_1 = require("../modules/users-auth/entities/refresh-token.entity");
const venta_caja_entity_1 = require("../modules/caja-registradora/entities/venta-caja.entity");
const detalle_venta_caja_entity_1 = require("../modules/caja-registradora/entities/detalle-venta-caja.entity");
const pago_caja_entity_1 = require("../modules/caja-registradora/entities/pago-caja.entity");
const comprobante_afip_entity_1 = require("../modules/caja-registradora/entities/comprobante-afip.entity");
const movimiento_inventario_entity_1 = require("../modules/caja-registradora/entities/movimiento-inventario.entity");
const snapshot_inventario_entity_1 = require("../modules/caja-registradora/entities/snapshot-inventario.entity");
const stock_entity_1 = require("../modules/stock/entities/stock.entity");
const gasto_entity_1 = require("../modules/gastos/entities/gasto.entity");
const categoria_gasto_entity_1 = require("../modules/gastos/entities/categoria-gasto.entity");
const usuario_auth_map_entity_1 = require("../modules/users-auth/entities/usuario-auth-map.entity");
(0, dotenv_1.config)({ path: path.join(__dirname, '../../.env') });
const BATCH_SIZE = 1000;
async function main() {
    console.log('Starting legacy migration...');
    const dataSource = new typeorm_1.DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USERNAME || 'mudras',
        password: process.env.DB_PASSWORD || 'mudras2025',
        database: process.env.DB_DATABASE || 'mudras',
        entities: [
            articulo_entity_1.Articulo,
            proveedor_entity_1.Proveedor,
            stock_entity_1.Stock,
            rubro_entity_1.Rubro,
            usuario_entity_1.Usuario,
            cliente_entity_1.Cliente,
            cuenta_corriente_entity_1.CuentaCorriente,
            movimiento_cuenta_corriente_entity_1.MovimientoCuentaCorriente,
            asiento_contable_entity_1.AsientoContable,
            detalle_asiento_contable_entity_1.DetalleAsientoContable,
            cuenta_contable_entity_1.CuentaContable,
            venta_entity_1.Venta,
            detalle_venta_entity_1.DetalleVenta,
            promocion_entity_1.Promocion,
            movimiento_stock_entity_1.MovimientoStock,
            user_entity_1.UserAuth,
            role_entity_1.Role,
            permission_entity_1.Permission,
            role_permission_entity_1.RolePermission,
            user_role_entity_1.UserRole,
            user_provider_entity_1.UserProvider,
            refresh_token_entity_1.RefreshToken,
            venta_caja_entity_1.VentaCaja,
            detalle_venta_caja_entity_1.DetalleVentaCaja,
            pago_caja_entity_1.PagoCaja,
            comprobante_afip_entity_1.ComprobanteAfip,
            movimiento_inventario_entity_1.MovimientoInventario,
            snapshot_inventario_entity_1.SnapshotInventarioMensual,
            punto_mudras_entity_1.PuntoMudras,
            stock_punto_mudras_entity_1.StockPuntoMudras,
            movimiento_stock_punto_entity_1.MovimientoStockPunto,
            orden_compra_entity_1.OrdenCompra,
            detalle_orden_compra_entity_1.DetalleOrdenCompra,
            gasto_entity_1.Gasto,
            categoria_gasto_entity_1.CategoriaGasto,
            proveedor_rubro_entity_1.ProveedorRubro,
            usuario_auth_map_entity_1.UsuarioAuthMap,
            marca_entity_1.Marca,
        ],
        synchronize: true,
    });
    try {
        await dataSource.initialize();
        console.log('Database connected.');
        const puntoRepo = dataSource.getRepository(punto_mudras_entity_1.PuntoMudras);
        let mudrasPoint = await puntoRepo.findOne({ where: { nombre: 'Mudras' } });
        if (!mudrasPoint) {
            console.log('Creating "Mudras" Point of Sale...');
            mudrasPoint = puntoRepo.create({
                nombre: 'Mudras',
                tipo: punto_mudras_entity_1.TipoPuntoMudras.venta,
                direccion: 'Local Principal',
                activo: true,
                manejaStockFisico: true,
                permiteVentasOnline: true
            });
            await puntoRepo.save(mudrasPoint);
        }
        else {
            console.log('"Mudras" POS already exists: ' + mudrasPoint.id);
        }
        const marcaRepo = dataSource.getRepository(marca_entity_1.Marca);
        console.log('Migrating Marcas...');
        await processFile('tbmarcas.sql', async (line) => {
            const valuesMatch = line.match(/values\s*\((.+)\);?$/i);
            if (valuesMatch) {
                const valuesPart = valuesMatch[1].trim();
                const parts = splitCsv(valuesPart);
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
        const rubroRepo = dataSource.getRepository(rubro_entity_1.Rubro);
        const rubrosMap = new Map();
        console.log('Migrating Rubros...');
        await processFile('tbrubros.sql', async (line) => {
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
        const provRepo = dataSource.getRepository(proveedor_entity_1.Proveedor);
        const oldProvIdMap = new Map();
        console.log('Migrating Proveedores...');
        await processFile('tbproveedores.sql', async (line) => {
            if (!line.match(/INSERT INTO/i))
                return;
            const valuesMatch = line.match(/values\s*\((.+)\);?$/i);
            if (!valuesMatch)
                return;
            const valuesPart = valuesMatch[1].trim();
            const parts = splitCsv(valuesPart);
            if (parts.length >= 1) {
                const oldId = parseInt(parts[0]);
                const nombre = cleanString(parts[2]);
                const codProv = cleanString(parts[1]);
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
                        Codigo: codProv,
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
        const artRepo = dataSource.getRepository(articulo_entity_1.Articulo);
        const articuloMap = new Map();
        const providerRubroPairs = new Set();
        console.log('Migrating Articulos...');
        let processedArts = 0;
        await processFile('tbarticulos.sql', async (line) => {
            if (!line.match(/INSERT INTO/i))
                return;
            const valuesMatch = line.match(/values\s*\((.+)\);?$/i);
            if (!valuesMatch)
                return;
            const valuesPart = valuesMatch[1].trim();
            const parts = splitCsv(valuesPart);
            if (parts.length > 0) {
                const codigo = cleanString(parts[0]);
                if (!codigo)
                    return;
                let art = await artRepo.findOne({ where: { Codigo: codigo } });
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
                art.Descripcion = cleanString(parts[2]);
                art.Rubro = rubroName;
                art.rubro = rubroEntity;
                art.Marca = cleanString(parts[3]);
                art.PrecioVenta = parseFloat(parts[4]) || 0;
                art.PrecioCompra = parseFloat(parts[5]) || 0;
                art.StockMinimo = parseFloat(parts[6]) || 0;
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
                art.Calculado = false;
                await artRepo.save(art);
                articuloMap.set(codigo, art);
                const stockQty = parseFloat(parts[7]) || 0;
                let stockEntry = await dataSource.getRepository(stock_punto_mudras_entity_1.StockPuntoMudras).findOne({
                    where: { puntoMudrasId: mudrasPoint.id, articuloId: art.id }
                });
                if (!stockEntry) {
                    stockEntry = dataSource.getRepository(stock_punto_mudras_entity_1.StockPuntoMudras).create({
                        puntoMudrasId: mudrasPoint.id,
                        articuloId: art.id,
                        cantidad: stockQty,
                        stockMinimo: art.StockMinimo || 0
                    });
                }
                else {
                    stockEntry.cantidad = stockQty;
                    stockEntry.stockMinimo = art.StockMinimo || 0;
                }
                await dataSource.getRepository(stock_punto_mudras_entity_1.StockPuntoMudras).save(stockEntry);
                processedArts++;
                if (processedArts % 500 === 0)
                    process.stdout.write('.');
            }
        });
        console.log(`\nprocessed ${processedArts} Articulos and Stock entries.`);
        const provRubroRepo = dataSource.getRepository(proveedor_rubro_entity_1.ProveedorRubro);
        console.log('Creating Provider-Rubro relations...');
        for (const pair of providerRubroPairs) {
            const [pId, rId] = pair.split('|').map(Number);
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
        console.log('Stock migration integrated into Articulos processing.');
        console.log('Migration Complete!');
    }
    catch (error) {
        console.error('Migration failed', error);
    }
    finally {
        if (dataSource.isInitialized)
            await dataSource.destroy();
    }
}
async function processFile(filename, callback) {
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
        if (line.trim().length === 0)
            continue;
        await callback(line);
    }
}
function cleanString(str) {
    if (!str)
        return '';
    if (str === 'NULL')
        return null;
    return str.replace(/^'/, '').replace(/'$/, '').trim();
}
function splitCsv(str) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === "'") {
            inQuotes = !inQuotes;
            current += char;
        }
        else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        }
        else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}
main();
//# sourceMappingURL=migrate-legacy.js.map