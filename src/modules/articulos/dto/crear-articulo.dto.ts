import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray, IsDateString, Min, Max } from 'class-validator';
import { EstadoArticulo } from '../entities/articulo.entity';

@InputType()
export class CrearArticuloDto {
  @Field()
  @IsString()
  Codigo: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Rubro?: string;

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Unidad?: string;

  // Nuevos campos
  @Field({ defaultValue: 'unidad' })
  @IsString()
  unidadMedida: string;

  @Field(() => Float, { defaultValue: 1 })
  @IsNumber()
  @Min(0.001)
  cantidadPorEmpaque: number;

  @Field({ defaultValue: 'unidad' })
  @IsString()
  tipoEmpaque: string;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  descuentoPorcentaje: number;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  @Min(0)
  descuentoMonto: number;

  @Field({ defaultValue: false })
  @IsBoolean()
  EnPromocion: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fechaInicioPromocion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fechaFinPromocion?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  publicadoEnTienda: boolean;

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

  @Field({ defaultValue: true })
  @IsBoolean()
  manejaStock: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  idProveedor?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  rubroId?: number;

  @Field(() => EstadoArticulo, { defaultValue: EstadoArticulo.ACTIVO })
  @IsEnum(EstadoArticulo)
  estado: EstadoArticulo;
}
