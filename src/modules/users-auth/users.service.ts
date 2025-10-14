import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserAuth } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { randomUUID } from 'crypto';

export interface CrearUsuarioDto {
  username: string;
  email?: string | null;
  displayName: string;
  passwordTemporal: string;
  isActive?: boolean;
  roles?: string[]; // slugs
}

export interface ActualizarUsuarioDto {
  id: string;
  email?: string | null;
  displayName?: string;
  isActive?: boolean;
  roles?: string[]; // slugs, reemplazar
}

export interface FiltrosUsuariosAuth {
  busqueda?: string;
  username?: string;
  email?: string;
  nombre?: string;
  estado?: string;
}

export interface ListarUsuariosInput extends FiltrosUsuariosAuth {
  pagina?: number;
  limite?: number;
}

export interface UsuarioAuthResumen {
  id: string;
  username: string | null;
  email: string | null;
  displayName: string;
  userType: 'EMPRESA' | 'CLIENTE';
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserAuth) private readonly usersRepo: Repository<UserAuth>,
    @InjectRepository(UserRole) private readonly userRolesRepo: Repository<UserRole>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  async listar(entrada: ListarUsuariosInput = {}): Promise<{ items: UsuarioAuthResumen[]; total: number }> {
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
        consulta.andWhere(
          `(
            LOWER(COALESCE(usuario.username, '')) LIKE :busqueda${indice}
            OR LOWER(COALESCE(usuario.email, '')) LIKE :busqueda${indice}
            OR LOWER(COALESCE(usuario.displayName, '')) LIKE :busqueda${indice}
          )`,
          { [`busqueda${indice}`]: `%${termino}%` },
        );
      });
    }

    if (entrada.username?.trim()) {
      consulta.andWhere(
        "LOWER(COALESCE(usuario.username, '')) LIKE :username",
        { username: `%${entrada.username.trim().toLowerCase()}%` },
      );
    }

    if (entrada.email?.trim()) {
      consulta.andWhere(
        "LOWER(COALESCE(usuario.email, '')) LIKE :email",
        { email: `%${entrada.email.trim().toLowerCase()}%` },
      );
    }

    if (entrada.nombre?.trim()) {
      consulta.andWhere(
        "LOWER(COALESCE(usuario.displayName, '')) LIKE :nombre",
        { nombre: `%${entrada.nombre.trim().toLowerCase()}%` },
      );
    }

    if (entrada.estado?.trim()) {
      const estadoNormalizado = entrada.estado.trim().toLowerCase();
      if (estadoNormalizado === 'activo') {
        consulta.andWhere('usuario.isActive = :estadoActivo', { estadoActivo: true });
      } else if (estadoNormalizado === 'inactivo') {
        consulta.andWhere('usuario.isActive = :estadoActivo', { estadoActivo: false });
      }
    }

    const [usuarios, total] = await consulta.getManyAndCount();

    return {
      items: usuarios.map((usuario) => this.mapearUsuario(usuario)),
      total,
    };
  }

  async crear(dto: CrearUsuarioDto) {
    const existente = await this.usersRepo.findOne({ where: [{ username: dto.username }, { email: dto.email ?? undefined }] });
    if (existente) throw new BadRequestException('Usuario ya existe');
    const user: UserAuth = this.usersRepo.create({
      id: randomUUID(),
      username: dto.username,
      email: dto.email ?? null,
      displayName: dto.displayName,
      userType: 'EMPRESA',
      mustChangePassword: true,
      isActive: dto.isActive ?? true,
      passwordHash: await bcrypt.hash(dto.passwordTemporal, 10),
    } as unknown as UserAuth);
    await this.usersRepo.save(user);

    if (dto.roles?.length) {
      const roles = await this.rolesRepo.find({ where: { slug: In(dto.roles) } });
      for (const rol of roles) {
        await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: rol.id }));
      }
    }
    return this.obtener(user.id);
  }

  async obtener(id: string): Promise<UsuarioAuthResumen> {
    const usuario = await this.usersRepo.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return this.mapearUsuario(usuario);
  }

  async actualizar(dto: ActualizarUsuarioDto) {
    const user = await this.usersRepo.findOne({ where: { id: dto.id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.displayName !== undefined) user.displayName = dto.displayName;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    await this.usersRepo.save(user);

    if (dto.roles) {
      // Reemplazar asignaciones
      await this.userRolesRepo.delete({ userId: user.id });
      const roles = await this.rolesRepo.find({ where: { slug: In(dto.roles) } });
      for (const rol of roles) {
        await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: rol.id }));
      }
    }
    return this.obtener(user.id);
  }

  async eliminar(id: string) {
    const ok = await this.usersRepo.delete({ id });
    return ok.affected! > 0;
  }

  async asignarRoles(id: string, rolesSlugs: string[]) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.userRolesRepo.delete({ userId: id });
    const roles = await this.rolesRepo.find({ where: { slug: In(rolesSlugs) } });
    for (const rol of roles) {
      await this.userRolesRepo.save(this.userRolesRepo.create({ userId: id, roleId: rol.id }));
    }
    return this.obtener(id);
  }

  async listarPorRolSlug(rolSlug: string): Promise<UsuarioAuthResumen[]> {
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

  private mapearUsuario(usuario: UserAuth & { userRoles?: UserRole[] }): UsuarioAuthResumen {
    const roles = (usuario.userRoles ?? [])
      .map((relacion) => relacion.role?.slug)
      .filter((slug): slug is string => Boolean(slug));

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
}
