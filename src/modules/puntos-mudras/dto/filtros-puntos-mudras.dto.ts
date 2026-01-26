import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsBoolean, IsString, IsInt, Min, Max } from 'class-validator';
import { TipoPuntoMudras } from '../entities/punto-mudras.entity';

import { TipoMovimientoStockPunto } from '../entities/movimiento-stock-punto.entity';

@InputType()
export class FiltrosPuntosMudrasInput {
  @Field(() => TipoPuntoMudras, { nullable: true })
  @IsOptional()
  @IsEnum(TipoPuntoMudras)
  tipo?: TipoPuntoMudras;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  busqueda?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limite?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ordenarPor?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  direccionOrden?: 'ASC' | 'DESC';
}

@InputType()
export class FiltrosStockInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  busqueda?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  soloConStock?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  soloBajoStock?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limite?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}

@InputType()
export class FiltrosMovimientosInput {
  @Field(() => TipoMovimientoStockPunto, { nullable: true })
  @IsOptional()
  @IsEnum(TipoMovimientoStockPunto)
  tipoMovimiento?: TipoMovimientoStockPunto;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fechaDesde?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fechaHasta?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  articuloId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limite?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
