import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class DetalleRecepcionDto {
  @Field(() => Int)
  @IsInt()
  detalleId: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  cantidadRecibida: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costoUnitario?: number;
}

@InputType()
export class RecepcionarOrdenDto {
  @Field(() => Int)
  @IsInt()
  ordenId: number;

  @Field(() => [DetalleRecepcionDto])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleRecepcionDto)
  detalles: DetalleRecepcionDto[];

  @Field(() => Int, { nullable: true, description: 'Si se especifica, recepciona en ese punto; si no, se suma al stock central (columna Stock de tbarticulos).'} )
  @IsOptional()
  @IsInt()
  puntoMudrasId?: number;
}
