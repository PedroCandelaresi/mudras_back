import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class FiltrosArticuloDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  busqueda?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  codigo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  marca?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  rubroId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  proveedorId?: number;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsNumber({}, { each: true })
  rubroIds?: number[];

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsNumber({}, { each: true })
  proveedorIds?: number[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  soloConStock?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  soloStockBajo?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  soloSinStock?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  soloEnPromocion?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  soloPublicadosEnTienda?: boolean;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  precioMinimo?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  precioMaximo?: number;

  @Field({ defaultValue: 0 })
  @IsNumber()
  pagina: number;

  @Field({ defaultValue: 50 })
  @IsNumber()
  limite: number;

  @Field({ defaultValue: 'Descripcion' })
  @IsString()
  ordenarPor: string;

  @Field({ defaultValue: 'ASC' })
  @IsString()
  direccionOrden: 'ASC' | 'DESC';
}
