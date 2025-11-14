import { InputType, Field, Float, Int, ID } from '@nestjs/graphql';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

@InputType()
export class ActualizarGastoDto {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  montoNeto?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  alicuotaIva?: number;

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

