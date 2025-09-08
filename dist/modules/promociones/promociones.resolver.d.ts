import { PromocionesService } from './promociones.service';
import { Promocion } from './entities/promocion.entity';
import { CrearPromocionInput } from './dto/crear-promocion.input';
import { ActualizarPromocionInput } from './dto/actualizar-promocion.input';
export declare class PromocionesResolver {
    private readonly service;
    constructor(service: PromocionesService);
    listar(): Promise<Promocion[]>;
    crearPromocion(input: CrearPromocionInput): Promise<Promocion>;
    actualizarPromocion(id: string, input: ActualizarPromocionInput): Promise<Promocion>;
    eliminarPromocion(id: string): Promise<boolean>;
}
