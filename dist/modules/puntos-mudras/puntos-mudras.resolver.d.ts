import { PuntosMudrasService } from './puntos-mudras.service';
import { PuntoMudras } from './entities/punto-mudras.entity';
import { CrearPuntoMudrasDto } from './dto/crear-punto-mudras.dto';
import { ActualizarPuntoMudrasDto } from './dto/actualizar-punto-mudras.dto';
export declare class EstadisticasPuntosMudras {
    totalPuntos: number;
    puntosVenta: number;
    depositos: number;
    puntosActivos: number;
    articulosConStock: number;
    valorTotalInventario: number;
    movimientosHoy: number;
}
export declare class PuntosMudrasResolver {
    private readonly puntosMudrasService;
    constructor(puntosMudrasService: PuntosMudrasService);
    obtenerPuntosMudras(): Promise<PuntoMudras[]>;
    obtenerPuntoMudrasPorId(id: number): Promise<PuntoMudras>;
    obtenerEstadisticasPuntosMudras(): Promise<EstadisticasPuntosMudras>;
    crearPuntoMudras(input: CrearPuntoMudrasDto): Promise<PuntoMudras>;
    actualizarPuntoMudras(input: ActualizarPuntoMudrasDto): Promise<PuntoMudras>;
    eliminarPuntoMudras(id: number): Promise<boolean>;
}
