import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permisos } from '../auth/decorators/permissions.decorator';

@Resolver(() => Stock)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class StockResolver {
  constructor(private readonly stockService: StockService) {}

  @Query(() => [Stock], { name: 'movimientosStock' })
  @Permisos('stock.read')
  findAll() {
    return this.stockService.findAll();
  }

  @Query(() => Stock, { name: 'movimientoStock' })
  @Permisos('stock.read')
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.stockService.findOne(id);
  }

  @Query(() => [Stock], { name: 'movimientosPorCodigo' })
  @Permisos('stock.read')
  findByCodigo(@Args('codigo') codigo: string) {
    return this.stockService.findByCodigo(codigo);
  }

  @Query(() => [Stock], { name: 'movimientosPorFecha' })
  @Permisos('stock.read')
  findMovimientosPorFecha(
    @Args('fechaInicio') fechaInicio: Date,
    @Args('fechaFin') fechaFin: Date,
  ) {
    return this.stockService.findMovimientosPorFecha(fechaInicio, fechaFin);
  }

  @Query(() => Stock, { name: 'ultimoMovimientoPorCodigo' })
  @Permisos('stock.read')
  findUltimoMovimientoPorCodigo(@Args('codigo') codigo: string) {
    return this.stockService.findUltimoMovimientoPorCodigo(codigo);
  }
}
