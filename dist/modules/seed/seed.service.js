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
let SeedService = SeedService_1 = class SeedService {
    constructor(userAuthRepo, roleRepo, userRoleRepo, usuarioRepo, usuarioAuthMapRepo, articuloRepo, rubroRepo, proveedorRepo) {
        this.userAuthRepo = userAuthRepo;
        this.roleRepo = roleRepo;
        this.userRoleRepo = userRoleRepo;
        this.usuarioRepo = usuarioRepo;
        this.usuarioAuthMapRepo = usuarioAuthMapRepo;
        this.articuloRepo = articuloRepo;
        this.rubroRepo = rubroRepo;
        this.proveedorRepo = proveedorRepo;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async onModuleInit() {
        this.logger.log('🌱 Iniciando verificación de semillas...');
        await this.seedAdmin();
        await this.seedProducoDemo();
    }
    async seedAdmin() {
        const adminEmail = 'administrador@mudras.com';
        const adminUsername = 'administrador.mudras';
        const rawPassword = 'Cambiar123!';
        let adminRole = await this.roleRepo.findOne({ where: { slug: 'admin' } });
        if (!adminRole) {
            this.logger.log('Creando rol admin...');
            adminRole = this.roleRepo.create({
                id: (0, crypto_1.randomUUID)(),
                name: 'Administrador',
                slug: 'admin',
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
            let proveedor = await this.proveedorRepo.findOne({ where: { Codigo: 999 } });
            if (!proveedor) {
                proveedor = this.proveedorRepo.create({ Nombre: 'Proveedor Demo', Codigo: 999 });
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
    __param(3, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(4, (0, typeorm_1.InjectRepository)(usuario_auth_map_entity_1.UsuarioAuthMap)),
    __param(5, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __param(6, (0, typeorm_1.InjectRepository)(rubro_entity_1.Rubro)),
    __param(7, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map