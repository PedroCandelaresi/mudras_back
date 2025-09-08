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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
const user_role_entity_1 = require("./entities/user-role.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const crypto_1 = require("crypto");
let UsersService = class UsersService {
    constructor(usersRepo, userRolesRepo, rolesRepo) {
        this.usersRepo = usersRepo;
        this.userRolesRepo = userRolesRepo;
        this.rolesRepo = rolesRepo;
    }
    async listar(pagina = 0, limite = 20) {
        const [items, total] = await this.usersRepo.findAndCount({
            skip: pagina * limite,
            take: limite,
            order: { createdAt: 'DESC' },
        });
        return { items, total };
    }
    async crear(dto) {
        const existente = await this.usersRepo.findOne({ where: [{ username: dto.username }, { email: dto.email ?? undefined }] });
        if (existente)
            throw new common_1.BadRequestException('Usuario ya existe');
        const user = this.usersRepo.create({
            id: (0, crypto_1.randomUUID)(),
            username: dto.username,
            email: dto.email ?? null,
            displayName: dto.displayName,
            userType: 'EMPRESA',
            mustChangePassword: true,
            isActive: dto.isActive ?? true,
            passwordHash: await bcrypt.hash(dto.passwordTemporal, 10),
        });
        await this.usersRepo.save(user);
        if (dto.roles?.length) {
            const roles = await this.rolesRepo.find({ where: dto.roles.map((slug) => ({ slug })) });
            for (const r of roles) {
                await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: r.id }));
            }
        }
        return this.obtener(user.id);
    }
    async obtener(id) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const roles = await this.userRolesRepo.find({ where: { userId: id }, relations: ['role'] });
        return { ...user, roles: roles.map((r) => r.role.slug) };
    }
    async actualizar(dto) {
        const user = await this.usersRepo.findOne({ where: { id: dto.id } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (dto.email !== undefined)
            user.email = dto.email;
        if (dto.displayName !== undefined)
            user.displayName = dto.displayName;
        if (dto.isActive !== undefined)
            user.isActive = dto.isActive;
        await this.usersRepo.save(user);
        if (dto.roles) {
            await this.userRolesRepo.delete({ userId: user.id });
            const roles = await this.rolesRepo.find({ where: dto.roles.map((slug) => ({ slug })) });
            for (const r of roles) {
                await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: r.id }));
            }
        }
        return this.obtener(user.id);
    }
    async eliminar(id) {
        const ok = await this.usersRepo.delete({ id });
        return ok.affected > 0;
    }
    async asignarRoles(id, rolesSlugs) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        await this.userRolesRepo.delete({ userId: id });
        const roles = await this.rolesRepo.find({ where: rolesSlugs.map((slug) => ({ slug })) });
        for (const r of roles)
            await this.userRolesRepo.save(this.userRolesRepo.create({ userId: id, roleId: r.id }));
        return this.obtener(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserAuth)),
    __param(1, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map