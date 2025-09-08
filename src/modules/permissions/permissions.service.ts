import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { randomUUID } from 'crypto';
import { CrearPermisoDto } from './dto/crear-permiso.dto';
import { ActualizarPermisoDto } from './dto/actualizar-permiso.dto';

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private readonly permsRepo: Repository<Permission>) {}

  listar() { return this.permsRepo.find(); }

  async crear(dto: CrearPermisoDto) {
    const p = this.permsRepo.create({ id: randomUUID(), resource: dto.resource, action: dto.action, description: dto.description ?? null } as Permission);
    return this.permsRepo.save(p);
  }

  async actualizar(dto: ActualizarPermisoDto) {
    const p = await this.permsRepo.findOne({ where: { id: dto.id } });
    if (!p) throw new NotFoundException('Permiso no encontrado');
    if (dto.resource !== undefined) p.resource = dto.resource;
    if (dto.action !== undefined) p.action = dto.action;
    if (dto.description !== undefined) p.description = dto.description;
    return this.permsRepo.save(p);
  }

  async eliminar(id: string) { const res = await this.permsRepo.delete({ id }); return res.affected! > 0; }
}
