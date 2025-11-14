import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

@InputType()
export class CrearGastoDto {
  @Field()
  @IsDateString()
  fecha: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  montoNeto: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  alicuotaIva?: number; // 10.5 o 21

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  proveedorId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  categoriaId?: number;
}

