import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promocion, EstadoPromocion } from './entities/promocion.entity';
import { CrearPromocionInput } from './dto/crear-promocion.input';
import { ActualizarPromocionInput } from './dto/actualizar-promocion.input';

@Injectable()
export class PromocionesService {
  constructor(
    @InjectRepository(Promocion) private readonly repo: Repository<Promocion>,
  ) {}

  async listar(): Promise<Promocion[]> {
    return this.repo.find({ order: { inicio: 'DESC' } });
  }

  async crear(input: CrearPromocionInput): Promise<Promocion> {
    const estado = input.estado ?? EstadoPromocion.PROGRAMADA;
    const entity = this.repo.create({ ...input, estado });
    return this.repo.save(entity);
  }

  async actualizar(id: string, input: Partial<ActualizarPromocionInput>): Promise<Promocion> {
    const prom = await this.repo.findOne({ where: { id } });
    if (!prom) throw new NotFoundException('Promoción no encontrada');
    Object.assign(prom, input);
    return this.repo.save(prom);
  }

  async eliminar(id: string): Promise<boolean> {
    const prom = await this.repo.findOne({ where: { id } });
    if (!prom) throw new NotFoundException('Promoción no encontrada');
    await this.repo.remove(prom);
    return true;
  }
}
