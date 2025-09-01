import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';
export declare class StockResolver {
    private readonly stockService;
    constructor(stockService: StockService);
    findAll(): Promise<Stock[]>;
    findOne(id: number): Promise<Stock>;
    findByCodigo(codigo: string): Promise<Stock[]>;
    findMovimientosPorFecha(fechaInicio: Date, fechaFin: Date): Promise<Stock[]>;
    findUltimoMovimientoPorCodigo(codigo: string): Promise<Stock>;
}
