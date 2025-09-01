import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, MaxLength, IsEnum, IsDecimal, IsDateString, Matches } from 'class-validator';
import { TipoCliente, EstadoCliente } from '../entities/cliente.entity';

@InputType()
export class CreateClienteDto {
  @Field()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  apellido?: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  razonSocial?: string;

  @Field({ nullable: true })
  @IsString()
  @Matches(/^\d{2}-\d{8}-\d{1}$/, { message: 'CUIT debe tener formato XX-XXXXXXXX-X' })
  @IsOptional()
  cuit?: string;

  @Field({ nullable: true })
  @IsEmail()
  @MaxLength(150)
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  telefono?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  direccion?: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  ciudad?: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  provincia?: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(10)
  @IsOptional()
  codigoPostal?: string;

  @Field(() => TipoCliente, { defaultValue: TipoCliente.MINORISTA })
  @IsEnum(TipoCliente)
  @IsOptional()
  tipo?: TipoCliente;

  @Field(() => EstadoCliente, { defaultValue: EstadoCliente.ACTIVO })
  @IsEnum(EstadoCliente)
  @IsOptional()
  estado?: EstadoCliente;

  @Field({ defaultValue: 0 })
  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  descuentoGeneral?: number;

  @Field({ defaultValue: 0 })
  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  limiteCredito?: number;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  fechaNacimiento?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
