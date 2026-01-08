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
    async listarEmpresaPorRolSlug(rolSlug) {
        const rows = await this.usersRepo
            .createQueryBuilder('u')
            .leftJoin('u.userRoles', 'ur')
            .leftJoin('ur.role', 'r')
            .where('u.userType = :typ', { typ: 'EMPRESA' })
            .andWhere('u.isActive = :act', { act: true })
            .andWhere('r.slug = :slug', { slug: rolSlug })
            .orderBy('u.displayName', 'ASC')
            .getMany();
        return rows;
    }
    async listar(entrada = {}) {
        const paginaNormalizada = Math.max(0, entrada.pagina ?? 0);
        const limiteNormalizado = Math.min(Math.max(1, entrada.limite ?? 20), 100);
        const consulta = this.usersRepo
            .createQueryBuilder('usuario')
            .leftJoinAndSelect('usuario.userRoles', 'usuarioRol')
            .leftJoinAndSelect('usuarioRol.role', 'rol')
            .distinct(true)
            .orderBy('usuario.createdAt', 'DESC')
            .skip(paginaNormalizada * limiteNormalizado)
            .take(limiteNormalizado);
        if (entrada.busqueda?.trim()) {
            const terminos = entrada.busqueda
                .trim()
                .toLowerCase()
                .split(/\s+/)
                .filter(Boolean);
            terminos.forEach((termino, indice) => {
                consulta.andWhere(`(
            LOWER(COALESCE(usuario.username, '')) LIKE :busqueda${indice}
            OR LOWER(COALESCE(usuario.email, '')) LIKE :busqueda${indice}
            OR LOWER(COALESCE(usuario.displayName, '')) LIKE :busqueda${indice}
          )`, { [`busqueda${indice}`]: `%${termino}%` });
            });
        }
        if (entrada.username?.trim()) {
            consulta.andWhere("LOWER(COALESCE(usuario.username, '')) LIKE :username", { username: `%${entrada.username.trim().toLowerCase()}%` });
        }
        if (entrada.email?.trim()) {
            consulta.andWhere("LOWER(COALESCE(usuario.email, '')) LIKE :email", { email: `%${entrada.email.trim().toLowerCase()}%` });
        }
        if (entrada.nombre?.trim()) {
            consulta.andWhere("LOWER(COALESCE(usuario.displayName, '')) LIKE :nombre", { nombre: `%${entrada.nombre.trim().toLowerCase()}%` });
        }
        if (entrada.estado?.trim()) {
            const estadoNormalizado = entrada.estado.trim().toLowerCase();
            if (estadoNormalizado === 'activo') {
                consulta.andWhere('usuario.isActive = :estadoActivo', { estadoActivo: true });
            }
            else if (estadoNormalizado === 'inactivo') {
                consulta.andWhere('usuario.isActive = :estadoActivo', { estadoActivo: false });
            }
        }
        const [usuarios, total] = await consulta.getManyAndCount();
        return {
            items: usuarios.map((usuario) => this.mapearUsuario(usuario)),
            total,
        };
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
            const roles = await this.rolesRepo.find({ where: { slug: (0, typeorm_2.In)(dto.roles) } });
            for (const rol of roles) {
                await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: rol.id }));
            }
        }
        try {
            const username = dto.username || '';
            let nombre = '';
            let apellido = '';
            if (username.includes('.')) {
                const [n, a] = username.split('.', 2);
                nombre = (n || '').trim();
                apellido = (a || '').trim();
            }
            if (!nombre || !apellido) {
                const partes = (dto.displayName || '').split(/\s+/).filter(Boolean);
                if (partes.length >= 2) {
                    nombre = partes.slice(0, -1).join(' ');
                    apellido = partes.slice(-1).join(' ');
                }
                else if (partes.length === 1) {
                    nombre = partes[0];
                    apellido = '';
                }
            }
            const passwordHash = await bcrypt.hash(dto.passwordTemporal, 10);
            await this.usersRepo.query(`INSERT INTO mudras_usuarios (nombre, apellido, username, email, password, rol, estado, salario)
         SELECT ?, ?, ?, ?, ?, ?, ?, 0.00
         WHERE NOT EXISTS (
           SELECT 1 FROM mudras_usuarios u WHERE u.username = ? OR (u.email IS NOT NULL AND u.email = ?)
         )`, [nombre || username, apellido || '', username, dto.email ?? null, passwordHash, 'caja', 'activo', username, dto.email ?? null]);
            const fila = await this.usersRepo.query(`SELECT id FROM mudras_usuarios WHERE username = ? LIMIT 1`, [username]);
            const usuarioId = fila?.[0]?.id != null ? Number(fila[0].id) : undefined;
            if (usuarioId && Number.isFinite(usuarioId)) {
                await this.usersRepo.query(`INSERT INTO mudras_usuarios_auth_map (usuario_id, auth_user_id)
           SELECT ?, ?
           WHERE NOT EXISTS (SELECT 1 FROM mudras_usuarios_auth_map WHERE usuario_id = ? OR auth_user_id = ?)`, [usuarioId, user.id, usuarioId, user.id]);
            }
        }
        catch (e) {
        }
        return this.obtener(user.id);
    }
    async obtener(id) {
        const usuario = await this.usersRepo.findOne({
            where: { id },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return this.mapearUsuario(usuario);
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
            const roles = await this.rolesRepo.find({ where: { slug: (0, typeorm_2.In)(dto.roles) } });
            for (const rol of roles) {
                await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: rol.id }));
            }
        }
        return this.obtener(user.id);
    }
    async eliminar(id) {
        try {
            await this.usersRepo.query(`DELETE FROM mudras_usuarios_auth_map WHERE auth_user_id = ?`, [id]);
        }
        catch { }
        const ok = await this.usersRepo.delete({ id });
        return ok.affected > 0;
    }
    async asignarRoles(id, rolesSlugs) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        await this.userRolesRepo.delete({ userId: id });
        const roles = await this.rolesRepo.find({ where: { slug: (0, typeorm_2.In)(rolesSlugs) } });
        for (const rol of roles) {
            await this.userRolesRepo.save(this.userRolesRepo.create({ userId: id, roleId: rol.id }));
        }
        return this.obtener(id);
    }
    async listarPorRolSlug(rolSlug) {
        const usuarios = await this.usersRepo
            .createQueryBuilder('usuario')
            .leftJoinAndSelect('usuario.userRoles', 'usuarioRol')
            .leftJoinAndSelect('usuarioRol.role', 'rol')
            .where('rol.slug = :rolSlug', { rolSlug })
            .andWhere('usuario.userType = :tipo', { tipo: 'EMPRESA' })
            .andWhere('usuario.isActive = :activo', { activo: true })
            .orderBy('usuario.displayName', 'ASC')
            .getMany();
        return usuarios.map((usuario) => this.mapearUsuario(usuario));
    }
    mapearUsuario(usuario) {
        const roles = (usuario.userRoles ?? [])
            .map((relacion) => relacion.role?.slug)
            .filter((slug) => Boolean(slug));
        return {
            id: usuario.id,
            username: usuario.username,
            email: usuario.email,
            displayName: usuario.displayName,
            userType: usuario.userType,
            isActive: usuario.isActive,
            mustChangePassword: usuario.mustChangePassword,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt,
            roles,
        };
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