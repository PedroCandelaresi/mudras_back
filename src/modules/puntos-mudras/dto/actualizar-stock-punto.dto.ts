import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class ActualizarStockPuntoInput {
  @Field(() => Int)
  @IsNumber()
  puntoMudrasId: number;

  @Field(() => Int)
  @IsNumber()
  articuloId: number;

  @Field(() => Float)
  @IsNumber()
  nuevaCantidad: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  estanteria?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  estante?: string;
}
