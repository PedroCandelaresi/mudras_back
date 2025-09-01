import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';

@Resolver(() => Stock)
export class StockResolver {
  constructor(private readonly stockService: StockService) {}

  @Query(() => [Stock], { name: 'movimientosStock' })
  findAll() {
    return this.stockService.findAll();
  }

  @Query(() => Stock, { name: 'movimientoStock' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.stockService.findOne(id);
  }

  @Query(() => [Stock], { name: 'movimientosPorCodigo' })
  findByCodigo(@Args('codigo') codigo: string) {
    return this.stockService.findByCodigo(codigo);
  }

  @Query(() => [Stock], { name: 'movimientosPorFecha' })
  findMovimientosPorFecha(
    @Args('fechaInicio') fechaInicio: Date,
    @Args('fechaFin') fechaFin: Date,
  ) {
    return this.stockService.findMovimientosPorFecha(fechaInicio, fechaFin);
  }

  @Query(() => Stock, { name: 'ultimoMovimientoPorCodigo' })
  findUltimoMovimientoPorCodigo(@Args('codigo') codigo: string) {
    return this.stockService.findUltimoMovimientoPorCodigo(codigo);
  }
}
