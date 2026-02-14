"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users-auth/entities/user.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const user_role_entity_1 = require("../users-auth/entities/user-role.entity");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
const usuario_auth_map_entity_1 = require("../users-auth/entities/usuario-auth-map.entity");
const articulo_entity_1 = require("../articulos/entities/articulo.entity");
const rubro_entity_1 = require("../rubros/entities/rubro.entity");
const proveedor_entity_1 = require("../proveedores/entities/proveedor.entity");
const punto_mudras_entity_1 = require("../puntos-mudras/entities/punto-mudras.entity");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const role_permission_entity_1 = require("../roles/entities/role-permission.entity");
let SeedService = SeedService_1 = class SeedService {
    constructor(userAuthRepo, roleRepo, userRoleRepo, permissionRepo, rolePermissionRepo, usuarioRepo, usuarioAuthMapRepo, articuloRepo, rubroRepo, proveedorRepo, puntosMudrasRepo) {
        this.userAuthRepo = userAuthRepo;
        this.roleRepo = roleRepo;
        this.userRoleRepo = userRoleRepo;
        this.permissionRepo = permissionRepo;
        this.rolePermissionRepo = rolePermissionRepo;
        this.usuarioRepo = usuarioRepo;
        this.usuarioAuthMapRepo = usuarioAuthMapRepo;
        this.articuloRepo = articuloRepo;
        this.rubroRepo = rubroRepo;
        this.proveedorRepo = proveedorRepo;
        this.puntosMudrasRepo = puntosMudrasRepo;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async onModuleInit() {
        this.logger.log('🌱 Iniciando verificación de semillas...');
        await this.seedPuntosMudras();
        await this.seedAdmin();
        await this.seedRBAC();
        await this.seedVendedores();
        await this.seedProducoDemo();
    }
    async seedPuntosMudras() {
        const mudras = await this.puntosMudrasRepo.findOne({ where: { nombre: 'Mudras' } });
        if (!mudras) {
            this.logger.log('🆕 Creando Mudras (Tienda Principal) por defecto...');
            await this.puntosMudrasRepo.save(this.puntosMudrasRepo.create({
                nombre: 'Mudras',
                tipo: punto_mudras_entity_1.TipoPuntoMudras.venta,
                descripcion: 'Punto de venta principal Mudras',
                direccion: 'Dirección Principal',
                activo: true,
                permiteVentasOnline: true,
                manejaStockFisico: true,
            }));
            this.logger.log('✅ Mudras creado.');
        }
        const depositoPrimario = await this.puntosMudrasRepo.findOne({ where: { nombre: 'Depósito Primario' } });
        if (!depositoPrimario) {
            this.logger.log('🆕 Creando Depósito Primario por defecto...');
            await this.puntosMudrasRepo.save(this.puntosMudrasRepo.create({
                nombre: 'Depósito Primario',
                tipo: punto_mudras_entity_1.TipoPuntoMudras.deposito,
                descripcion: 'Depósito central por defecto',
                direccion: 'Depósito Central',
                activo: true,
                permiteVentasOnline: false,
                manejaStockFisico: true,
            }));
            this.logger.log('✅ Depósito Primario creado.');
        }
    }
    async seedAdmin() {
        const adminEmail = 'administrador@mudras.com';
        const adminUsername = 'administrador.mudras';
        const rawPassword = 'Cambiar123!';
        let adminRole = await this.roleRepo.findOne({ where: { slug: 'administrador' } });
        if (!adminRole) {
            this.logger.log('Creando rol admin...');
            adminRole = this.roleRepo.create({
                id: (0, crypto_1.randomUUID)(),
                name: 'Administrador',
                slug: 'administrador',
            });
            await this.roleRepo.save(adminRole);
        }
        let adminUser = await this.userAuthRepo.findOne({
            where: [{ username: adminUsername }, { email: adminEmail }],
        });
        if (!adminUser) {
            this.logger.log('Creando usuario administrador...');
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            adminUser = this.userAuthRepo.create({
                id: (0, crypto_1.randomUUID)(),
                username: adminUsername,
                email: adminEmail,
                displayName: 'Administrador Sistema',
                passwordHash: hashedPassword,
                userType: 'EMPRESA',
                isActive: true,
                mustChangePassword: true,
            });
            await this.userAuthRepo.save(adminUser);
            const userRole = this.userRoleRepo.create({
                userId: adminUser.id,
                roleId: adminRole.id,
            });
            await this.userRoleRepo.save(userRole);
            this.logger.log(`✅ Usuario admin creado: ${adminUsername} / ${rawPassword}`);
        }
        else {
            this.logger.log('Usuario admin ya existe.');
        }
        let usuarioLegacy = await this.usuarioRepo.findOne({ where: { username: adminUsername } });
        if (!usuarioLegacy && adminUser) {
            this.logger.log('Creando usuario legacy para admin...');
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            const newUser = {
                username: adminUsername,
                nombre: 'Administrador',
                apellido: 'Sistema',
                email: adminEmail,
                password: hashedPassword,
                rol: usuario_entity_1.RolUsuario.ADMINISTRADOR,
                estado: usuario_entity_1.EstadoUsuario.ACTIVO,
                salario: 0
            };
            usuarioLegacy = this.usuarioRepo.create(newUser);
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
    async seedRBAC() {
        const ensurePerm = async (resource, action, description) => {
            let p = await this.permissionRepo.findOne({ where: { resource, action } });
            if (!p) {
                p = this.permissionRepo.create({
                    id: (0, crypto_1.randomUUID)(),
                    resource,
                    action,
                    description: description || `Permiso para ${action} ${resource}`
                });
                await this.permissionRepo.save(p);
            }
            return p;
        };
        const assign = async (role, perm) => {
            const exists = await this.rolePermissionRepo.findOne({ where: { roleId: role.id, permissionId: perm.id } });
            if (!exists) {
                await this.rolePermissionRepo.save(this.rolePermissionRepo.create({
                    roleId: role.id,
                    permissionId: perm.id
                }));
            }
        };
        const definitions = [
            { r: 'dashboard', a: ['read'] },
            { r: 'usuarios', a: ['read', 'create', 'update', 'delete'] },
            { r: 'roles', a: ['read', 'create', 'update', 'delete'] },
            { r: 'productos', a: ['read', 'create', 'delete', 'update', 'update:precios', 'update:costos', 'update:info', 'update:stock'] },
            { r: 'stock', a: ['read', 'update'] },
            { r: 'depositos', a: ['read', 'create', 'update'] },
            { r: 'puntos_venta', a: ['read', 'create', 'update'] },
            { r: 'rubros', a: ['read', 'create', 'update'] },
            { r: 'proveedores', a: ['read', 'create', 'update', 'delete'] },
            { r: 'compras', a: ['read', 'create', 'update'] },
            { r: 'gastos', a: ['read', 'create', 'update'] },
            { r: 'ventas', a: ['read', 'create', 'update', 'delete'] },
            { r: 'caja', a: ['read', 'create', 'update'] },
            { r: 'clientes', a: ['read', 'create', 'update'] },
            { r: 'pedidos', a: ['read', 'create', 'update'] },
            { r: 'promociones', a: ['read', 'create', 'update'] },
            { r: 'tienda_online', a: ['read', 'update'] },
            { r: 'puntos_mudras', a: ['read', 'update'] },
            { r: 'contabilidad', a: ['read', 'create', 'update'] },
            { r: 'cuentas', a: ['read', 'create', 'update'] },
        ];
        const permsCache = {};
        for (const def of definitions) {
            for (const action of def.a) {
                const key = `${def.r}:${action}`;
                permsCache[key] = await ensurePerm(def.r, action);
            }
        }
        const requiredRoles = [
            { slug: 'administrador', name: 'Administrador' },
            { slug: 'cajero', name: 'Cajero / Vendedor' },
            { slug: 'deposito', name: 'Encargado Depósito' },
            { slug: 'compras', name: 'Administrativo Compras' },
            { slug: 'finanzas', name: 'Contador / Finanzas' },
            { slug: 'tienda_online', name: 'Encargada Tienda Online' },
            { slug: 'disenadora', name: 'Diseñadora' },
        ];
        const roles = {};
        for (const req of requiredRoles) {
            let r = await this.roleRepo.findOne({ where: { slug: req.slug } });
            if (!r) {
                r = this.roleRepo.create({
                    id: (0, crypto_1.randomUUID)(),
                    name: req.name,
                    slug: req.slug,
                });
                await this.roleRepo.save(r);
            }
            roles[req.slug] = r;
        }
        if (roles['administrador']) {
            for (const key in permsCache) {
                await assign(roles['administrador'], permsCache[key]);
            }
        }
        if (roles['cajero']) {
            const targets = [
                'caja:read', 'caja:create',
                'ventas:read', 'ventas:create',
                'clientes:read', 'clientes:create', 'clientes:update',
                'productos:read',
                'promociones:read',
                'pedidos:read',
                'dashboard:read'
            ];
            for (const t of targets)
                if (permsCache[t])
                    await assign(roles['cajero'], permsCache[t]);
        }
        if (roles['deposito']) {
            const targets = [
                'depositos:read', 'depositos:update',
                'stock:read', 'stock:update',
                'productos:read',
                'proveedores:read',
                'puntos_venta:read',
                'dashboard:read'
            ];
            for (const t of targets)
                if (permsCache[t])
                    await assign(roles['deposito'], permsCache[t]);
        }
        if (roles['compras']) {
            const targets = [
                'proveedores:read', 'proveedores:create', 'proveedores:update',
                'productos:read', 'productos:create', 'productos:update', 'rubros:read',
                'compras:read', 'compras:create', 'compras:update',
                'gastos:read', 'gastos:create',
                'stock:read',
                'dashboard:read'
            ];
            for (const t of targets)
                if (permsCache[t])
                    await assign(roles['compras'], permsCache[t]);
        }
        if (roles['finanzas']) {
            const targets = [
                'contabilidad:read', 'contabilidad:create', 'contabilidad:update',
                'cuentas:read', 'cuentas:create', 'cuentas:update',
                'ventas:read',
                'caja:read',
                'gastos:read', 'gastos:update',
                'dashboard:read'
            ];
            for (const t of targets)
                if (permsCache[t])
                    await assign(roles['finanzas'], permsCache[t]);
        }
        if (roles['tienda_online']) {
            const targets = [
                'tienda_online:read', 'tienda_online:update',
                'pedidos:read', 'pedidos:create', 'pedidos:update',
                'productos:read',
                'clientes:read',
                'promociones:read',
                'dashboard:read'
            ];
            for (const t of targets)
                if (permsCache[t])
                    await assign(roles['tienda_online'], permsCache[t]);
        }
        if (roles['disenadora']) {
            const targets = [
                'promociones:read', 'promociones:create', 'promociones:update',
                'tienda_online:read',
                'productos:read',
                'productos:update:info',
                'dashboard:read'
            ];
            for (const t of targets)
                if (permsCache[t])
                    await assign(roles['disenadora'], permsCache[t]);
        }
        this.logger.log('✅ RBAC Full Inicializado.');
    }
    async seedVendedores() {
        const vendedores = [
            { nombre: 'Carlos', username: 'carlos', email: 'carlos@mudras.com', pass: 'Carlos123!' },
            { nombre: 'Graciela', username: 'graciela', email: 'graciela@mudras.com', pass: 'Graciela123!' }
        ];
        let cajeroRole = await this.roleRepo.findOne({ where: { slug: 'cajero' } });
        if (!cajeroRole) {
            this.logger.warn('⚠️ Rol cajero no encontrado al crear vendedores. Creándolo...');
            cajeroRole = this.roleRepo.create({
                id: (0, crypto_1.randomUUID)(),
                name: 'Cajero / Vendedor',
                slug: 'cajero',
            });
            await this.roleRepo.save(cajeroRole);
        }
        for (const v of vendedores) {
            let userAuth = await this.userAuthRepo.findOne({ where: { username: v.username } });
            if (!userAuth) {
                const hashedPassword = await bcrypt.hash(v.pass, 10);
                userAuth = this.userAuthRepo.create({
                    id: (0, crypto_1.randomUUID)(),
                    username: v.username,
                    email: v.email,
                    displayName: v.nombre,
                    passwordHash: hashedPassword,
                    userType: 'EMPRESA',
                    isActive: true,
                    mustChangePassword: false,
                });
                await this.userAuthRepo.save(userAuth);
                await this.userRoleRepo.save(this.userRoleRepo.create({
                    userId: userAuth.id,
                    roleId: cajeroRole.id
                }));
                this.logger.log(`✅ UserAuth creado: ${v.username}`);
            }
            let usuarioLegacy = await this.usuarioRepo.findOne({ where: { username: v.username } });
            if (!usuarioLegacy) {
                const hashedPassword = await bcrypt.hash(v.pass, 10);
                usuarioLegacy = this.usuarioRepo.create({
                    username: v.username,
                    nombre: v.nombre,
                    apellido: 'Vendedor',
                    email: v.email,
                    password: hashedPassword,
                    rol: usuario_entity_1.RolUsuario.CAJA,
                    estado: usuario_entity_1.EstadoUsuario.ACTIVO,
                    salario: 0
                });
                await this.usuarioRepo.save(usuarioLegacy);
                this.logger.log(`✅ Usuario legacy creado: ${v.username}`);
            }
            const map = await this.usuarioAuthMapRepo.findOne({ where: { authUserId: userAuth.id } });
            if (!map && usuarioLegacy) {
                await this.usuarioAuthMapRepo.save({
                    usuarioId: usuarioLegacy.id,
                    authUserId: userAuth.id
                });
            }
        }
    }
    async seedProducoDemo() {
        const demoCodigo = 'DEMO001';
        let articulo = await this.articuloRepo.findOne({ where: { Codigo: demoCodigo } });
        if (!articulo) {
            this.logger.log('Creating demo product...');
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
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserAuth)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __param(3, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(4, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __param(5, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(6, (0, typeorm_1.InjectRepository)(usuario_auth_map_entity_1.UsuarioAuthMap)),
    __param(7, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __param(8, (0, typeorm_1.InjectRepository)(rubro_entity_1.Rubro)),
    __param(9, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __param(10, (0, typeorm_1.InjectRepository)(punto_mudras_entity_1.PuntoMudras)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map