import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { VentaCaja, EstadoVentaCaja, TipoVentaCaja } from '../entities/venta-caja.entity';
import { MedioPagoCaja } from '../entities/pago-caja.entity';

@InputType()
export class FiltrosHistorialInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  usuarioId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  puestoVentaId?: number;

  @Field(() => MedioPagoCaja, { nullable: true })
  @IsOptional()
  @IsEnum(MedioPagoCaja)
  medioPago?: MedioPagoCaja;

  @Field(() => EstadoVentaCaja, { nullable: true })
  @IsOptional()
  @IsEnum(EstadoVentaCaja)
  estado?: EstadoVentaCaja;

  @Field(() => TipoVentaCaja, { nullable: true })
  @IsOptional()
  @IsEnum(TipoVentaCaja)
  tipoVenta?: TipoVentaCaja;

  @Field({ defaultValue: 50 })
  @IsNumber()
  limite: number = 50;

  @Field({ defaultValue: 0 })
  @IsNumber()
  offset: number = 0;
}

@ObjectType()
export class ResumenVenta {
  @Field()
  id: number;

  @Field()
  numeroVenta: string;

  @Field()
  fecha: Date;

  @Field()
  nombreCliente: string;

  @Field()
  nombreUsuario: string;

  @Field()
  nombrePuesto: string;

  @Field()
  total: number;

  @Field(() => EstadoVentaCaja)
  estado: EstadoVentaCaja;

  @Field(() => TipoVentaCaja)
  tipoVenta: TipoVentaCaja;

  @Field()
  cantidadItems: number;

  @Field(() => [String])
  mediosPago: string[];
}

@ObjectType()
export class HistorialVentasResponse {
  @Field(() => [ResumenVenta])
  ventas: ResumenVenta[];

  @Field()
  total: number;

  @Field()
  totalPaginas: number;

  @Field()
  paginaActual: number;
}
