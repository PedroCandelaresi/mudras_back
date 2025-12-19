import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNumber, IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class AsignacionItemInput {
  @Field(() => Int)
  @IsNumber()
  articuloId: number;

  @Field(() => Float)
  @IsNumber()
  cantidad: number;
}

@InputType()
export class AsignarStockMasivoInput {
  @Field(() => Int)
  @IsNumber()
  puntoMudrasId: number;

  @Field(() => [AsignacionItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsignacionItemInput)
  asignaciones: AsignacionItemInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  motivo?: string;
}
