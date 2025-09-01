import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
export declare class StockService {
    private stockRepository;
    constructor(stockRepository: Repository<Stock>);
    findAll(): Promise<Stock[]>;
    findOne(id: number): Promise<Stock>;
    findByCodigo(codigo: string): Promise<Stock[]>;
    findMovimientosPorFecha(fechaInicio: Date, fechaFin: Date): Promise<Stock[]>;
    findUltimoMovimientoPorCodigo(codigo: string): Promise<Stock>;
}
