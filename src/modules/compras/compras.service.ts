import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra, EstadoOrdenCompra } from './entities/orden-compra.entity';
import { DetalleOrdenCompra } from './entities/detalle-orden-compra.entity';
import { CrearOrdenCompraDto } from './dto/crear-orden-compra.dto';
import { AgregarDetalleOcDto } from './dto/agregar-detalle-oc.dto';
import { RecepcionarOrdenDto } from './dto/recepcionar-orden.dto';
import { Articulo } from '../articulos/entities/articulo.entity';
import { StockPuntoMudras } from '../puntos-mudras/entities/stock-punto-mudras.entity';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(OrdenCompra) private ordenRepo: Repository<OrdenCompra>,
    @InjectRepository(DetalleOrdenCompra) private detalleRepo: Repository<DetalleOrdenCompra>,
    @InjectRepository(Articulo) private articuloRepo: Repository<Articulo>,
    @InjectRepository(StockPuntoMudras) private stockPuntoRepo: Repository<StockPuntoMudras>,
  ) {}

  async crearOrden(dto: CrearOrdenCompraDto): Promise<OrdenCompra> {
    const orden = this.ordenRepo.create({ proveedorId: dto.proveedorId, observaciones: dto.observaciones, estado: EstadoOrdenCompra.BORRADOR });
    return this.ordenRepo.save(orden);
  }

  async agregarDetalle(dto: AgregarDetalleOcDto): Promise<DetalleOrdenCompra> {
    const orden = await this.ordenRepo.findOne({ where: { id: dto.ordenId } });
    if (!orden) throw new NotFoundException('Orden no encontrada');
    if (orden.estado !== EstadoOrdenCompra.BORRADOR) throw new BadRequestException('Solo se pueden agregar detalles en BORRADOR');
    const detalle = this.detalleRepo.create({ ...dto });
    return this.detalleRepo.save(detalle);
  }

  async eliminarDetalle(id: number): Promise<boolean> {
    const det = await this.detalleRepo.findOne({ where: { id } });
    if (!det) throw new NotFoundException('Detalle no encontrado');
    await this.detalleRepo.delete(id);
    return true;
  }

  async emitirOrden(id: number): Promise<OrdenCompra> {
    const orden = await this.ordenRepo.findOne({ where: { id }, relations: ['detalles'] });
    if (!orden) throw new NotFoundException('Orden no encontrada');
    if (!orden.detalles || orden.detalles.length === 0) throw new BadRequestException('La orden no tiene detalles');
    orden.estado = EstadoOrdenCompra.EMITIDA;
    orden.fechaEmision = new Date();
    return this.ordenRepo.save(orden);
  }

  async recepcionarOrden(input: RecepcionarOrdenDto): Promise<OrdenCompra> {
    const orden = await this.ordenRepo.findOne({ where: { id: input.ordenId }, relations: ['detalles'] });
    if (!orden) throw new NotFoundException('Orden no encontrada');
    if (orden.estado !== EstadoOrdenCompra.EMITIDA && orden.estado !== EstadoOrdenCompra.BORRADOR) {
      throw new BadRequestException('La orden debe estar EMITIDA o BORRADOR para recepcionar');
    }

    const byId = new Map(input.detalles.map(d => [d.detalleId, d] as const));
    for (const det of orden.detalles || []) {
      const data = byId.get(det.id);
      if (!data) continue;
      const cantidadRec = Number(data.cantidadRecibida || 0);
      if (cantidadRec <= 0) continue;
      det.cantidadRecibida = (det.cantidadRecibida || 0) + cantidadRec;
      if (data.costoUnitario != null) det.costoUnitarioRecepcion = Number(data.costoUnitario);
      await this.detalleRepo.save(det);

      // Actualizar stock y costo promedio
      const art = await this.articuloRepo.findOne({ where: { id: det.articuloId } });
      if (!art) continue;
      const costoUnit = data.costoUnitario != null ? Number(data.costoUnitario) : (det.precioUnitario ?? art.PrecioCompra ?? 0);

      if (input.puntoMudrasId && input.puntoMudrasId > 0) {
        // Stock en punto Mudras
        let stockPunto = await this.stockPuntoRepo.findOne({ where: { articuloId: art.id, puntoMudrasId: input.puntoMudrasId } });
        if (!stockPunto) {
          stockPunto = this.stockPuntoRepo.create({ articuloId: art.id, puntoMudrasId: input.puntoMudrasId, cantidad: 0 });
        }
        stockPunto.cantidad = Number(stockPunto.cantidad || 0) + cantidadRec;
        await this.stockPuntoRepo.save(stockPunto);
      } else {
        // Stock central (columna Stock en tbarticulos)
        const stockActual = Number(art.Stock || 0);
        const nuevoStock = stockActual + cantidadRec;
        const costoPromActual = Number(art.CostoPromedio || 0);
        const costoPromedio = nuevoStock > 0 ? ((costoPromActual * stockActual) + (costoUnit * cantidadRec)) / nuevoStock : costoUnit;
        await this.articuloRepo.update(art.id, { Stock: nuevoStock, CostoPromedio: costoPromedio, PrecioCompra: costoUnit });
      }
    }

    orden.estado = EstadoOrdenCompra.RECEPCIONADA;
    orden.fechaRecepcion = new Date();
    return this.ordenRepo.save(orden);
  }

  async getOrden(id: number): Promise<OrdenCompra> {
    return this.ordenRepo.findOne({ where: { id }, relations: ['detalles', 'proveedor'] });
  }

  async listar(estado?: EstadoOrdenCompra, proveedorId?: number): Promise<OrdenCompra[]> {
    const where: any = {};
    if (estado) where.estado = estado;
    if (proveedorId) where.proveedorId = proveedorId;
    return this.ordenRepo.find({ where, relations: ['proveedor'], order: { id: 'DESC' } });
  }
}
