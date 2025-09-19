import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class TransferirStockInput {
  @Field(() => Int)
  @IsInt({ message: 'El ID del punto origen debe ser un número entero' })
  puntoOrigenId: number;

  @Field(() => Int)
  @IsInt({ message: 'El ID del punto destino debe ser un número entero' })
  puntoDestinoId: number;

  @Field(() => Int)
  @IsInt({ message: 'El ID del artículo debe ser un número entero' })
  articuloId: number;

  @Field(() => Float)
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0.01, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  motivo?: string;
}

@InputType()
export class AjustarStockInput {
  @Field(() => Int)
  @IsInt({ message: 'El ID del punto debe ser un número entero' })
  puntoMudrasId: number;

  @Field(() => Int)
  @IsInt({ message: 'El ID del artículo debe ser un número entero' })
  articuloId: number;

  @Field(() => Float)
  @IsNumber({}, { message: 'La nueva cantidad debe ser un número' })
  @Min(0, { message: 'La cantidad no puede ser negativa' })
  nuevaCantidad: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  motivo?: string;
}
