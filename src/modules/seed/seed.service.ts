import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuth } from '../users-auth/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../users-auth/entities/user-role.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Usuario, RolUsuario, EstadoUsuario } from '../usuarios/entities/usuario.entity';
import { UsuarioAuthMap } from '../users-auth/entities/usuario-auth-map.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Rubro } from '../rubros/entities/rubro.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { PuntoMudras, TipoPuntoMudras } from '../puntos-mudras/entities/punto-mudras.entity';

import { Permission } from '../permissions/entities/permission.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectRepository(UserAuth)
        private readonly userAuthRepo: Repository<UserAuth>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectRepository(UserRole)
        private readonly userRoleRepo: Repository<UserRole>,
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepo: Repository<RolePermission>,
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
        @InjectRepository(UsuarioAuthMap)
        private readonly usuarioAuthMapRepo: Repository<UsuarioAuthMap>,
        @InjectRepository(Articulo)
        private readonly articuloRepo: Repository<Articulo>,
        @InjectRepository(Rubro)
        private readonly rubroRepo: Repository<Rubro>,
        @InjectRepository(Proveedor)
        private readonly proveedorRepo: Repository<Proveedor>,
        @InjectRepository(PuntoMudras)
        private readonly puntosMudrasRepo: Repository<PuntoMudras>,
    ) { }

    async onModuleInit() {
        this.logger.log('🌱 Iniciando verificación de semillas...');
        await this.seedPuntosMudras();
        await this.seedAdmin();
        await this.seedRBAC(); // New method
        await this.seedVendedores();
        await this.seedProducoDemo();
    }



    private async seedPuntosMudras() {
        // 1. Mudras (Tienda Principal)
        const mudras = await this.puntosMudrasRepo.findOne({ where: { nombre: 'Mudras' } });
        if (!mudras) {
            this.logger.log('🆕 Creando Mudras (Tienda Principal) por defecto...');
            await this.puntosMudrasRepo.save(this.puntosMudrasRepo.create({
                nombre: 'Mudras',
                tipo: TipoPuntoMudras.venta,
                descripcion: 'Punto de venta principal Mudras',
                direccion: 'Dirección Principal',
                activo: true,
                permiteVentasOnline: true,
                manejaStockFisico: true,
            }));
            this.logger.log('✅ Mudras creado.');
        }

        // 2. Depósito Primario
        const depositoPrimario = await this.puntosMudrasRepo.findOne({ where: { nombre: 'Depósito Primario' } });
        if (!depositoPrimario) {
            this.logger.log('🆕 Creando Depósito Primario por defecto...');
            await this.puntosMudrasRepo.save(this.puntosMudrasRepo.create({
                nombre: 'Depósito Primario',
                tipo: TipoPuntoMudras.deposito,
                descripcion: 'Depósito central por defecto',
                direccion: 'Depósito Central',
                activo: true,
                permiteVentasOnline: false,
                manejaStockFisico: true,
            }));
            this.logger.log('✅ Depósito Primario creado.');
        }
    }

    private async seedAdmin() {
        const adminEmail = 'administrador@mudras.com';
        const adminUsername = 'administrador.mudras';
        const rawPassword = 'Cambiar123!';

        // 1. Verificar Rol Admin
        let adminRole = await this.roleRepo.findOne({ where: { slug: 'admin' } });
        if (!adminRole) {
            this.logger.log('Creando rol admin...');
            adminRole = this.roleRepo.create({
                id: randomUUID(),
                name: 'Administrador',
                slug: 'admin',
            });
            await this.roleRepo.save(adminRole);
        }

        // 2. Verificar Usuario Auth
        let adminUser = await this.userAuthRepo.findOne({
            where: [{ username: adminUsername }, { email: adminEmail }],
        });

        if (!adminUser) {
            this.logger.log('Creando usuario administrador...');
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            adminUser = this.userAuthRepo.create({
                id: randomUUID(),
                username: adminUsername,
                email: adminEmail,
                displayName: 'Administrador Sistema',
                passwordHash: hashedPassword,
                userType: 'EMPRESA',
                isActive: true,
                mustChangePassword: true,
            } as unknown as UserAuth);
            await this.userAuthRepo.save(adminUser);

            // Asignar rol
            const userRole = this.userRoleRepo.create({
                userId: adminUser.id,
                roleId: adminRole.id,
            });
            await this.userRoleRepo.save(userRole);

            this.logger.log(`✅ Usuario admin creado: ${adminUsername} / ${rawPassword}`);
        } else {
            this.logger.log('Usuario admin ya existe.');
        }

        // 3. Crear Usuario Legacy (mudras_usuarios) y Mapa (mudras_usuarios_auth_map)
        let usuarioLegacy = await this.usuarioRepo.findOne({ where: { username: adminUsername } });

        if (!usuarioLegacy && adminUser) {
            this.logger.log('Creando usuario legacy para admin...');
            const hashedPassword = await bcrypt.hash(rawPassword, 10);

            const newUser: any = {
                username: adminUsername,
                nombre: 'Administrador',
                apellido: 'Sistema',
                email: adminEmail,
                password: hashedPassword,
                rol: RolUsuario.ADMINISTRADOR,
                estado: EstadoUsuario.ACTIVO,
                salario: 0
            };

            usuarioLegacy = (this.usuarioRepo.create(newUser) as unknown) as Usuario;
            await this.usuarioRepo.save(usuarioLegacy);
        }

        if (usuarioLegacy && adminUser) {
            const mapa = await this.usuarioAuthMapRepo.findOne({ where: { authUserId: adminUser.id } });
            if (!mapa) {
                this.logger.log('Creando mapa auth para admin...');
                await this.usuarioAuthMapRepo.save({
                    usuarioId: usuarioLegacy.id,
                    authUserId: adminUser.id
                });
            }
        }
    }

    private async seedRBAC() {
        // Wrapper for ensurePermission
        const ensurePerm = async (resource: string, action: string, description?: string) => {
            let p = await this.permissionRepo.findOne({ where: { resource, action } });
            if (!p) {
                // Typo check fallback removed as we want strict resource names now
                p = this.permissionRepo.create({
                    id: randomUUID(),
                    resource,
                    action,
                    description: description || `Permiso para ${action} ${resource}`
                });
                await this.permissionRepo.save(p);
            }
            return p;
        };

        // Assign helper
        const assign = async (role: Role, perm: Permission) => {
            const exists = await this.rolePermissionRepo.findOne({ where: { roleId: role.id, permissionId: perm.id } });
            if (!exists) {
                await this.rolePermissionRepo.save(this.rolePermissionRepo.create({
                    roleId: role.id,
                    permissionId: perm.id
                }));
            }
        };

        // 1. Define ALL Permissions based on Plan
        const definitions = [
            // Core / Dashboard
            { r: 'dashboard', a: ['read'] },
            { r: 'usuarios', a: ['read', 'create', 'update', 'delete'] },
            { r: 'roles', a: ['read', 'create', 'update', 'delete'] },

            // Inventario & Productos
            { r: 'productos', a: ['read', 'create', 'update', 'delete'] }, // Catalog
            { r: 'stock', a: ['read', 'update'] }, // Movements / Adjustments
            { r: 'depositos', a: ['read', 'create', 'update'] },
            { r: 'puntos_venta', a: ['read', 'create', 'update'] },
            { r: 'rubros', a: ['read', 'create', 'update'] },

            // Compras & Proveedores
            { r: 'proveedores', a: ['read', 'create', 'update', 'delete'] },
            { r: 'compras', a: ['read', 'create', 'update'] }, // Purchase Orders
            { r: 'gastos', a: ['read', 'create', 'update'] },

            // Ventas & Comercial
            { r: 'ventas', a: ['read', 'create', 'update', 'delete'] }, // Sales History / Management
            { r: 'caja', a: ['read', 'create', 'update'] }, // POS Operation & Closures
            { r: 'clientes', a: ['read', 'create', 'update'] },
            { r: 'pedidos', a: ['read', 'create', 'update'] },
            { r: 'promociones', a: ['read', 'create', 'update'] },
            { r: 'tienda_online', a: ['read', 'update'] },
            { r: 'puntos_mudras', a: ['read', 'update'] },

            // Finanzas
            { r: 'contabilidad', a: ['read', 'create', 'update'] },
            { r: 'cuentas', a: ['read', 'create', 'update'] }, // Cuentas Corrientes
        ];

        const permsCache: Record<string, Permission> = {};
        for (const def of definitions) {
            for (const action of def.a) {
                const key = `${def.r}:${action}`;
                permsCache[key] = await ensurePerm(def.r, action);
            }
        }

        // 2. Define Roles
        const requiredRoles = [
            { slug: 'administrador', name: 'Administrador' },
            { slug: 'cajero', name: 'Cajero / Vendedor' },
            { slug: 'deposito', name: 'Encargado Depósito' },
            { slug: 'compras', name: 'Administrativo Compras' },
            { slug: 'finanzas', name: 'Contador / Finanzas' },
            { slug: 'tienda_online', name: 'Encargada Tienda Online' },
            { slug: 'disenadora', name: 'Diseñadora' },
        ];

        const roles: Record<string, Role> = {};
        for (const req of requiredRoles) {
            let r = await this.roleRepo.findOne({ where: { slug: req.slug } });
            if (!r) {
                r = this.roleRepo.create({
                    id: randomUUID(),
                    name: req.name,
                    slug: req.slug,
                });
                await this.roleRepo.save(r);
            }
            roles[req.slug] = r;
        }

        // 3. Assign Permissions

        // ADMINISTRADOR: All
        if (roles['administrador']) {
            for (const key in permsCache) {
                await assign(roles['administrador'], permsCache[key]);
            }
        }

        // CAJERO: Caja, Ventas, Clientes, Pedidos, Promos (read), Productos (read)
        if (roles['cajero']) {
            const targets = [
                'caja:read', 'caja:create', // Operar caja
                'ventas:read', 'ventas:create', // Ver mis ventas, crear venta
                'clientes:read', 'clientes:create', 'clientes:update',
                'productos:read', // Buscar precio
                'promociones:read',
                'pedidos:read', // Ver pedidos a retirar
                'dashboard:read'
            ];
            for (const t of targets) if (permsCache[t]) await assign(roles['cajero'], permsCache[t]);
        }

        // DEPOSITO: Stock, Depositos, Productos (read), Proveedores (read)
        if (roles['deposito']) {
            const targets = [
                'depositos:read', 'depositos:update',
                'stock:read', 'stock:update',
                'productos:read',
                'proveedores:read', // Para recepcion
                'puntos_venta:read',
                'dashboard:read'
            ];
            for (const t of targets) if (permsCache[t]) await assign(roles['deposito'], permsCache[t]);
        }

        // COMPRAS: Proveedores, Productos (full), Compras, Gastos
        if (roles['compras']) {
            const targets = [
                'proveedores:read', 'proveedores:create', 'proveedores:update',
                'productos:read', 'productos:create', 'productos:update', 'rubros:read',
                'compras:read', 'compras:create', 'compras:update',
                'gastos:read', 'gastos:create',
                'stock:read',
                'dashboard:read'
            ];
            for (const t of targets) if (permsCache[t]) await assign(roles['compras'], permsCache[t]);
        }

        // FINANZAS: Contabilidad, Cuentas, Ventas (read), Caja (read), Gastos
        if (roles['finanzas']) {
            const targets = [
                'contabilidad:read', 'contabilidad:create', 'contabilidad:update',
                'cuentas:read', 'cuentas:create', 'cuentas:update',
                'ventas:read', // Reportes
                'caja:read', // Arqueos
                'gastos:read', 'gastos:update',
                'dashboard:read'
            ];
            for (const t of targets) if (permsCache[t]) await assign(roles['finanzas'], permsCache[t]);
        }

        // TIENDA_ONLINE
        if (roles['tienda_online']) {
            const targets = [
                'tienda_online:read', 'tienda_online:update',
                'pedidos:read', 'pedidos:create', 'pedidos:update',
                'productos:read',
                'clientes:read',
                'promociones:read',
                'dashboard:read'
            ];
            for (const t of targets) if (permsCache[t]) await assign(roles['tienda_online'], permsCache[t]);
        }

        // DISENADORA
        if (roles['disenadora']) {
            const targets = [
                'promociones:read', 'promociones:create', 'promociones:update',
                'tienda_online:read',
                'productos:read', // Ver fotos/desc
                'dashboard:read'
            ];
            for (const t of targets) if (permsCache[t]) await assign(roles['disenadora'], permsCache[t]);
        }

        this.logger.log('✅ RBAC Full Inicializado.');
    }

    private async seedVendedores() {
        const vendedores = [
            { nombre: 'Carlos', username: 'carlos', email: 'carlos@mudras.com', pass: 'Carlos123!' },
            { nombre: 'Graciela', username: 'graciela', email: 'graciela@mudras.com', pass: 'Graciela123!' }
        ];

        // Ensure "cajero" role exists (created in seedRBAC but safety check)
        let cajeroRole = await this.roleRepo.findOne({ where: { slug: 'cajero' } });
        if (!cajeroRole) {
            this.logger.warn('⚠️ Rol cajero no encontrado al crear vendedores. Creándolo...');
            cajeroRole = this.roleRepo.create({
                id: randomUUID(),
                name: 'Cajero / Vendedor',
                slug: 'cajero',
            });
            await this.roleRepo.save(cajeroRole);
        }

        for (const v of vendedores) {
            // 1. UserAuth
            let userAuth = await this.userAuthRepo.findOne({ where: { username: v.username } });
            if (!userAuth) {
                const hashedPassword = await bcrypt.hash(v.pass, 10);
                userAuth = this.userAuthRepo.create({
                    id: randomUUID(),
                    username: v.username,
                    email: v.email,
                    displayName: v.nombre,
                    passwordHash: hashedPassword,
                    userType: 'EMPRESA',
                    isActive: true,
                    mustChangePassword: false,
                } as unknown as UserAuth);
                await this.userAuthRepo.save(userAuth);

                await this.userRoleRepo.save(this.userRoleRepo.create({
                    userId: userAuth.id,
                    roleId: cajeroRole.id
                }));
                this.logger.log(`✅ UserAuth creado: ${v.username}`);
            }

            // 2. Usuario Legacy
            let usuarioLegacy = await this.usuarioRepo.findOne({ where: { username: v.username } });
            if (!usuarioLegacy) {
                const hashedPassword = await bcrypt.hash(v.pass, 10);
                usuarioLegacy = (this.usuarioRepo.create({
                    username: v.username,
                    nombre: v.nombre,
                    apellido: 'Vendedor', // Generic
                    email: v.email,
                    password: hashedPassword,
                    rol: RolUsuario.CAJA, // Important for legacy checks
                    estado: EstadoUsuario.ACTIVO,
                    salario: 0
                }) as unknown) as Usuario;
                await this.usuarioRepo.save(usuarioLegacy);
                this.logger.log(`✅ Usuario legacy creado: ${v.username}`);
            }

            // 3. Map
            const map = await this.usuarioAuthMapRepo.findOne({ where: { authUserId: userAuth.id } });
            if (!map && usuarioLegacy) {
                await this.usuarioAuthMapRepo.save({
                    usuarioId: usuarioLegacy.id,
                    authUserId: userAuth.id
                });
            }
        }
    }

    private async seedProducoDemo() {
        const demoCodigo = 'DEMO001';

        let articulo = await this.articuloRepo.findOne({ where: { Codigo: demoCodigo } });
        if (!articulo) {
            this.logger.log('Creating demo product...');

            // Crear Dependencias
            let rubro = await this.rubroRepo.findOne({ where: { Codigo: 'DEMO' } });
            if (!rubro) {
                rubro = this.rubroRepo.create({ Rubro: 'Demo', Codigo: 'DEMO' });
                await this.rubroRepo.save(rubro);
            }

            let proveedor = await this.proveedorRepo.findOne({ where: { Codigo: '999' } });
            if (!proveedor) {
                proveedor = this.proveedorRepo.create({ Nombre: 'Proveedor Demo', Codigo: '999' });
                await this.proveedorRepo.save(proveedor);
            }

            articulo = this.articuloRepo.create({
                Codigo: demoCodigo,
                Descripcion: 'Producto de demostración',
                PrecioVenta: 1000.00,
                PrecioCompra: 500.00,
                StockMinimo: 10,
                rubro: rubro,
                proveedor: proveedor,
                totalStock: 100,
                StockInicial: 100,
                Calculado: false,
                CostoEnDolares: false,
                AlicuotaIva: 21,
                Deposito: 0,
                FechaCompra: new Date(),
                idProveedor: proveedor.IdProveedor,
                rubroId: rubro.Id,
                Lista2: 0,
                Lista3: 0,
                Lista4: 0,
                PorcentajeGanancia: 100,
                CodigoProv: 'DEMO-PROV',
                CostoPromedio: 500,
                PrecioListaProveedor: 500,
                FechaModif: new Date(),
                Lista1EnDolares: false,
                Dto1: 0,
                Dto2: 0,
                Dto3: 0,
                Impuesto: 0,
                EnPromocion: false,
                UsaTalle: false,
                Compuesto: false,
                Combustible: false,
                ImpuestoPorcentual: false
            });

            await this.articuloRepo.save(articulo);
            this.logger.log('✅ Producto Demo creado: ' + demoCodigo);
        }
    }
}
