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
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("./entities/usuario.entity");
const bcrypt = require("bcrypt");
let UsuariosService = class UsuariosService {
    constructor(usuariosRepository) {
        this.usuariosRepository = usuariosRepository;
    }
    async create(createUsuarioDto) {
        const existingUser = await this.usuariosRepository.findOne({
            where: [
                { username: createUsuarioDto.username },
                { email: createUsuarioDto.email },
            ],
        });
        if (existingUser) {
            throw new common_1.ConflictException('El username o email ya están en uso');
        }
        const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
        const usuario = this.usuariosRepository.create({
            ...createUsuarioDto,
            password: hashedPassword,
            fechaIngreso: createUsuarioDto.fechaIngreso ? new Date(createUsuarioDto.fechaIngreso) : undefined,
        });
        return this.usuariosRepository.save(usuario);
    }
    async findAll() {
        return this.usuariosRepository.find({
            relations: ['cuentasCorrientes', 'asientosContables'],
            order: { creadoEn: 'DESC' },
        });
    }
    async findOne(id) {
        const usuario = await this.usuariosRepository.findOne({
            where: { id },
            relations: ['cuentasCorrientes', 'asientosContables'],
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return usuario;
    }
    async findByUsernameOrEmail(usernameOrEmail) {
        return this.usuariosRepository.findOne({
            where: [
                { username: usernameOrEmail },
                { email: usernameOrEmail },
            ],
        });
    }
    async update(id, updateUsuarioDto) {
        const usuario = await this.findOne(id);
        if (updateUsuarioDto.password) {
            updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
        }
        if (updateUsuarioDto.username || updateUsuarioDto.email) {
            const existingUser = await this.usuariosRepository.findOne({
                where: [
                    { username: updateUsuarioDto.username },
                    { email: updateUsuarioDto.email },
                ],
            });
            if (existingUser && existingUser.id !== id) {
                throw new common_1.ConflictException('El username o email ya están en uso');
            }
        }
        Object.assign(usuario, updateUsuarioDto);
        return this.usuariosRepository.save(usuario);
    }
    async remove(id) {
        const usuario = await this.findOne(id);
        await this.usuariosRepository.remove(usuario);
    }
    async login(loginDto) {
        const usuario = await this.findByUsernameOrEmail(loginDto.usernameOrEmail);
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        usuario.ultimoAcceso = new Date();
        await this.usuariosRepository.save(usuario);
        return usuario;
    }
    async findByRol(rol) {
        console.log('🛠️ [UsuariosService] findByRol:start', { rol });
        try {
            const resultado = await this.usuariosRepository.find({
                where: { rol },
                order: { nombre: 'ASC' },
            });
            console.log('🛠️ [UsuariosService] findByRol:resultado', {
                rol,
                cantidad: resultado.length,
            });
            return resultado;
        }
        catch (error) {
            console.error('🛠️ [UsuariosService] findByRol:error', { rol, error });
            throw error;
        }
    }
    async findByAuthRolSlug(rolSlug) {
        try {
            const rows = await this.usuariosRepository.query(`SELECT u.*
         FROM usuarios u
         JOIN usuarios_auth_map m ON m.usuario_id = u.id
         JOIN mudras_auth_user_roles ur ON ur.user_id = m.auth_user_id
         JOIN mudras_auth_roles r ON r.id = ur.role_id
         WHERE r.slug = ?
         ORDER BY u.nombre ASC`, [rolSlug]);
            return rows;
        }
        catch (error) {
            console.error('🛠️ [UsuariosService] findByAuthRolSlug:error', { rolSlug, error });
            return [];
        }
    }
    async createUsuariosEjemplo() {
        const usuariosEjemplo = [
            {
                nombre: 'Admin',
                apellido: 'Sistema',
                username: 'admin',
                email: 'admin@mudras.com',
                password: 'admin123',
                rol: usuario_entity_1.RolUsuario.ADMINISTRADOR,
                salario: 100000,
                fechaIngreso: '2024-01-01',
            },
            {
                nombre: 'Juan',
                apellido: 'Programador',
                username: 'jprogramador',
                email: 'programador@mudras.com',
                password: 'prog123',
                rol: usuario_entity_1.RolUsuario.PROGRAMADOR,
                salario: 80000,
                fechaIngreso: '2024-01-15',
            },
            {
                nombre: 'María',
                apellido: 'Cajera',
                username: 'mcajera',
                email: 'caja@mudras.com',
                password: 'caja123',
                rol: usuario_entity_1.RolUsuario.CAJA,
                salario: 45000,
                fechaIngreso: '2024-02-01',
            },
            {
                nombre: 'Carlos',
                apellido: 'Depósito',
                username: 'cdeposito',
                email: 'deposito@mudras.com',
                password: 'dep123',
                rol: usuario_entity_1.RolUsuario.DEPOSITO,
                salario: 50000,
                fechaIngreso: '2024-02-15',
            },
            {
                nombre: 'Ana',
                apellido: 'Diseñadora',
                username: 'adisenadora',
                email: 'diseno@mudras.com',
                password: 'dis123',
                rol: usuario_entity_1.RolUsuario.DIS_GRAFICO,
                salario: 60000,
                fechaIngreso: '2024-03-01',
            },
        ];
        for (const usuarioData of usuariosEjemplo) {
            const existingUser = await this.findByUsernameOrEmail(usuarioData.username);
            if (!existingUser) {
                await this.create(usuarioData);
            }
        }
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map