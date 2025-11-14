import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Articulo } from '../../articulos/entities/articulo.entity';

@InputType()
export class BuscarArticuloInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sku?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  puntoMudrasId?: number;

  @Field({ defaultValue: 10 })
  @IsNumber()
  @Min(1)
  limite: number = 10;
}

@ObjectType()
export class ArticuloConStock extends Articulo {
  @Field()
  stockDisponible: number;

  @Field()
  stockDespuesVenta: number; // Stock que quedaría después de la venta simulada

  @Field()
  alertaStock: boolean; // true si quedaría en negativo
}
