import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEnum, IsOptional, IsBoolean, IsEmail, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoPuntoMudras } from '../entities/punto-mudras.entity';

@InputType('CrearPuntoMudrasInput')
export class CrearPuntoMudrasDto {
  @Field()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @Field(() => String)
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  tipo: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  descripcion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres' })
  direccion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
  telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @MaxLength(100, { message: 'El email no puede exceder 100 caracteres' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  permiteVentasOnline?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  requiereAutorizacion?: boolean;
}
