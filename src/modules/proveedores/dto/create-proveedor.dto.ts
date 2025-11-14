import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, IsNumber, IsEmail, MaxLength } from 'class-validator';

@InputType()
export class CreateProveedorInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  Codigo?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  Nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  Contacto?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  Direccion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  Localidad?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  Provincia?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  CP?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  Telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  Celular?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  TipoIva?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(14)
  CUIT?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Observaciones?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  Web?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  Mail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  Rubro?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  rubroId?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  Saldo?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  PorcentajeRecargoProveedor?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  PorcentajeDescuentoProveedor?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  Pais?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  Fax?: string;
}
