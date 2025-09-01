import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray, IsDateString, Min, Max } from 'class-validator';
import { EstadoArticulo } from '../entities/articulo.entity';

@InputType()
export class ActualizarArticuloDto {
  @Field(() => ID)
  @IsNumber()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Codigo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Rubro?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Descripcion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Marca?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precioVenta?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  PrecioCompra?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Unidad?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  unidadMedida?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.001)
  cantidadPorEmpaque?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tipoEmpaque?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  descuentoPorcentaje?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  descuentoMonto?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  EnPromocion?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fechaInicioPromocion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fechaFinPromocion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  publicadoEnTienda?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcionTienda?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagenesUrls?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  manejaStock?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  idProveedor?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  rubroId?: number;

  @Field(() => EstadoArticulo, { nullable: true })
  @IsOptional()
  @IsEnum(EstadoArticulo)
  estado?: EstadoArticulo;
}
