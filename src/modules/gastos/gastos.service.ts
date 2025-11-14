import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gasto } from './entities/gasto.entity';
import { CategoriaGasto } from './entities/categoria-gasto.entity';
import { CrearGastoDto } from './dto/crear-gasto.dto';
import { ActualizarGastoDto } from './dto/actualizar-gasto.dto';
import { CrearCategoriaGastoDto } from './dto/crear-categoria-gasto.dto';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto) private gastoRepo: Repository<Gasto>,
    @InjectRepository(CategoriaGasto) private categoriaRepo: Repository<CategoriaGasto>,
  ) {}

  async listar(desde?: string, hasta?: string, categoriaId?: number, proveedorId?: number): Promise<Gasto[]> {
    const qb = this.gastoRepo.createQueryBuilder('gasto').leftJoinAndSelect('gasto.categoria', 'categoria').leftJoinAndSelect('gasto.proveedor', 'proveedor');
    if (desde) qb.andWhere('gasto.fecha >= :desde', { desde });
    if (hasta) qb.andWhere('gasto.fecha <= :hasta', { hasta });
    if (categoriaId) qb.andWhere('gasto.categoriaId = :categoriaId', { categoriaId });
    if (proveedorId) qb.andWhere('gasto.proveedorId = :proveedorId', { proveedorId });
    return qb.orderBy('gasto.fecha', 'DESC').getMany();
  }

  async crear(input: CrearGastoDto): Promise<Gasto> {
    const alic = input.alicuotaIva ?? 0;
    const ivaMonto = alic > 0 ? (input.montoNeto * alic) / 100 : 0;
    const total = input.montoNeto + ivaMonto;
    const gasto = this.gastoRepo.create({
      fecha: new Date(input.fecha),
      montoNeto: input.montoNeto,
      alicuotaIva: alic || null,
      montoIva: ivaMonto,
      total,
      descripcion: input.descripcion,
      proveedorId: input.proveedorId,
      categoriaId: input.categoriaId,
    });
    return this.gastoRepo.save(gasto);
  }

  async actualizar(input: ActualizarGastoDto): Promise<Gasto> {
    const gasto = await this.gastoRepo.findOne({ where: { id: input.id } });
    if (!gasto) throw new NotFoundException('Gasto no encontrado');
    const next = { ...gasto, ...input } as any;
    if (input.fecha) next.fecha = new Date(input.fecha);
    const alic = input.alicuotaIva != null ? input.alicuotaIva : next.alicuotaIva ?? 0;
    const neto = input.montoNeto != null ? input.montoNeto : next.montoNeto;
    const ivaMonto = alic > 0 ? (neto * alic) / 100 : 0;
    next.montoIva = ivaMonto;
    next.total = neto + ivaMonto;
    await this.gastoRepo.update(input.id, next);
    return this.gastoRepo.findOne({ where: { id: input.id }, relations: ['categoria', 'proveedor'] });
  }

  async eliminar(id: number): Promise<boolean> {
    await this.gastoRepo.delete(id);
    return true;
  }

  async crearCategoria(input: CrearCategoriaGastoDto): Promise<CategoriaGasto> {
    const cat = this.categoriaRepo.create({ ...input });
    return this.categoriaRepo.save(cat);
  }

  async listarCategorias(): Promise<CategoriaGasto[]> {
    return this.categoriaRepo.find({ order: { nombre: 'ASC' } });
  }
}

