import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { randomUUID } from 'crypto';

export interface CrearRolDto { name: string; slug: string; }
export interface ActualizarRolDto { id: string; name?: string; slug?: string; }

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
    @InjectRepository(RolePermission) private readonly rpRepo: Repository<RolePermission>,
    @InjectRepository(Permission) private readonly permsRepo: Repository<Permission>,
  ) {}

  listar() {
    return this.rolesRepo.find({ relations: ['rolePermissions', 'rolePermissions.permission'] });
  }

  listarPermisos() { return this.permsRepo.find(); }

  async crear(dto: CrearRolDto) { const r = this.rolesRepo.create({ id: randomUUID(), ...dto } as Role); return this.rolesRepo.save(r); }

  async actualizar(dto: ActualizarRolDto) {
    const r = await this.rolesRepo.findOne({ where: { id: dto.id } });
    if (!r) throw new NotFoundException('Rol no encontrado');
    if (dto.name !== undefined) r.name = dto.name;
    if (dto.slug !== undefined) r.slug = dto.slug;
    return this.rolesRepo.save(r);
  }

  async eliminar(id: string) { const res = await this.rolesRepo.delete({ id }); return res.affected! > 0; }

  async asignarPermisos(roleId: string, permissionIds: string[]) {
    const r = await this.rolesRepo.findOne({ where: { id: roleId } });
    if (!r) throw new NotFoundException('Rol no encontrado');
    await this.rpRepo.delete({ roleId });
    for (const pid of permissionIds) {
      await this.rpRepo.save(this.rpRepo.create({ roleId, permissionId: pid }));
    }
    return { ok: true };
  }
}
