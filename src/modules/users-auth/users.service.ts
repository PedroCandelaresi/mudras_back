import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserAuth) private readonly usersRepo: Repository<UserAuth>,
    @InjectRepository(UserRole) private readonly userRolesRepo: Repository<UserRole>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  async listar(pagina = 0, limite = 20) {
    const [items, total] = await this.usersRepo.findAndCount({
      skip: pagina * limite,
      take: limite,
      order: { createdAt: 'DESC' },
    });
    return { items, total };
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
      const roles = await this.rolesRepo.find({ where: dto.roles.map((slug) => ({ slug })) as any });
      for (const r of roles) {
        await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: r.id }));
      }
    }
    return this.obtener(user.id);
  }

  async obtener(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const roles = await this.userRolesRepo.find({ where: { userId: id }, relations: ['role'] });
    return { ...user, roles: roles.map((r) => r.role.slug) } as any;
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
      const roles = await this.rolesRepo.find({ where: dto.roles.map((slug) => ({ slug })) as any });
      for (const r of roles) {
        await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: r.id }));
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
    const roles = await this.rolesRepo.find({ where: rolesSlugs.map((slug) => ({ slug })) as any });
    for (const r of roles) await this.userRolesRepo.save(this.userRolesRepo.create({ userId: id, roleId: r.id }));
    return this.obtener(id);
  }
}
