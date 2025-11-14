import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsInt, IsNumber, Min, IsOptional } from 'class-validator';

@InputType()
export class AgregarDetalleOcDto {
  @Field(() => Int)
  @IsInt()
  ordenId: number;

  @Field(() => Int)
  @IsInt()
  articuloId: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0.0001)
  cantidad: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precioUnitario?: number;
}

