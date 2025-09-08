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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./entities/role.entity");
const role_permission_entity_1 = require("./entities/role-permission.entity");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const crypto_1 = require("crypto");
let RolesService = class RolesService {
    constructor(rolesRepo, rpRepo, permsRepo) {
        this.rolesRepo = rolesRepo;
        this.rpRepo = rpRepo;
        this.permsRepo = permsRepo;
    }
    listar() {
        return this.rolesRepo.find({ relations: ['rolePermissions', 'rolePermissions.permission'] });
    }
    listarPermisos() { return this.permsRepo.find(); }
    async crear(dto) { const r = this.rolesRepo.create({ id: (0, crypto_1.randomUUID)(), ...dto }); return this.rolesRepo.save(r); }
    async actualizar(dto) {
        const r = await this.rolesRepo.findOne({ where: { id: dto.id } });
        if (!r)
            throw new common_1.NotFoundException('Rol no encontrado');
        if (dto.name !== undefined)
            r.name = dto.name;
        if (dto.slug !== undefined)
            r.slug = dto.slug;
        return this.rolesRepo.save(r);
    }
    async eliminar(id) { const res = await this.rolesRepo.delete({ id }); return res.affected > 0; }
    async asignarPermisos(roleId, permissionIds) {
        const r = await this.rolesRepo.findOne({ where: { id: roleId } });
        if (!r)
            throw new common_1.NotFoundException('Rol no encontrado');
        await this.rpRepo.delete({ roleId });
        for (const pid of permissionIds) {
            await this.rpRepo.save(this.rpRepo.create({ roleId, permissionId: pid }));
        }
        return { ok: true };
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __param(2, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map