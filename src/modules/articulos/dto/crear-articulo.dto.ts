import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, Min, Max } from 'class-validator';

@InputType()
export class CrearArticuloDto {
  @Field()
  @IsString()
  Codigo: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Rubro?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  rubroId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ImagenUrl?: string;

  @Field()
  @IsString()
  Descripcion: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Marca?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  precioVenta: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  PrecioCompra?: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  stock: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  stockMinimo: number;

  @Field(() => Float, { nullable: true, description: 'Stock en depósito si se lleva control separado.' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deposito?: number;

  @Field(() => Float, { nullable: true, description: 'Alicuota de IVA: 10.5 o 21 (porcentaje).' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  AlicuotaIva?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  FechaCompra?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  idProveedor?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  Lista2?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  Lista3?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Unidad?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  Lista4?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  PorcentajeGanancia?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  Calculado?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  CodigoProv?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  CostoPromedio?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  CostoEnDolares?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  FechaModif?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  PrecioListaProveedor?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  StockInicial?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Ubicacion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  Lista1EnDolares?: boolean;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  Dto1?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  Dto2?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  Dto3?: number;

  @Field(() => Float, { nullable: true, description: 'Impuesto fijo aplicado si corresponde (no porcentaje).' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  Impuesto?: number;

  @Field({ nullable: true, description: 'True si el impuesto es porcentual (IVA).' })
  @IsOptional()
  @IsBoolean()
  ImpuestoPorcentual?: boolean;

  @Field({ defaultValue: false })
  @IsBoolean()
  EnPromocion: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  UsaTalle?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  Compuesto?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  Combustible?: boolean;
}
