import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.find({
      order: { Fecha: 'DESC', Id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Stock> {
    return this.stockRepository.findOne({
      where: { Id: id },
    });
  }

  async findByCodigo(codigo: string): Promise<Stock[]> {
    return this.stockRepository.find({
      where: { Codigo: codigo },
      order: { Fecha: 'DESC', Id: 'DESC' },
    });
  }

  async findMovimientosPorFecha(fechaInicio: Date, fechaFin: Date): Promise<Stock[]> {
    return this.stockRepository
      .createQueryBuilder('stock')
      .where('stock.Fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      })
      .orderBy('stock.Fecha', 'DESC')
      .addOrderBy('stock.Id', 'DESC')
      .getMany();
  }

  async findUltimoMovimientoPorCodigo(codigo: string): Promise<Stock> {
    return this.stockRepository.findOne({
      where: { Codigo: codigo },
      order: { Fecha: 'DESC', Id: 'DESC' },
    });
  }
}
