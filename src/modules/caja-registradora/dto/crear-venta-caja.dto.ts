import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsString, IsOptional, IsArray, ValidateNested, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoVentaCaja } from '../entities/venta-caja.entity';
import { MedioPagoCaja } from '../entities/pago-caja.entity';

@InputType()
export class DetalleVentaCajaInput {
  @Field(() => Int)
  @IsNumber()
  articuloId: number;

  @Field()
  @IsNumber()
  @Min(0.001)
  cantidad: number;

  @Field()
  @IsNumber()
  @Min(0)
  precioUnitario: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  descuentoPorcentaje?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  descuentoMonto?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

@InputType()
export class PagoCajaInput {
  @Field(() => MedioPagoCaja)
  @IsEnum(MedioPagoCaja)
  medioPago: MedioPagoCaja;

  @Field()
  @IsNumber()
  @Min(0.01)
  monto: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  marcaTarjeta?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ultimos4Digitos?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  cuotas?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  numeroAutorizacion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  numeroComprobante?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

@InputType()
export class CrearVentaCajaInput {
  @Field(() => TipoVentaCaja)
  @IsEnum(TipoVentaCaja)
  tipoVenta: TipoVentaCaja;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  clienteId?: number;

  @Field(() => Int)
  @IsNumber()
  puntoMudrasId: number;

  @Field(() => [DetalleVentaCajaInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaCajaInput)
  detalles: DetalleVentaCajaInput[];

  @Field(() => [PagoCajaInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PagoCajaInput)
  pagos: PagoCajaInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  descuentoPorcentaje?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  descuentoMonto?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  generarFactura: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cuitCliente?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombreCliente?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  razonSocialCliente?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  usuarioAuthId?: string;
}
