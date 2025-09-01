import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsOptional, IsDecimal, IsDateString, IsPhoneNumber } from 'class-validator';
import { RolUsuario, EstadoUsuario } from '../entities/usuario.entity';

@InputType()
export class CreateUsuarioDto {
  @Field()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @Field()
  @IsString()
  @MaxLength(100)
  apellido: string;

  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @Field()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @Field(() => RolUsuario)
  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @Field(() => EstadoUsuario, { defaultValue: EstadoUsuario.ACTIVO })
  @IsEnum(EstadoUsuario)
  @IsOptional()
  estado?: EstadoUsuario;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  telefono?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  direccion?: string;

  @Field({ defaultValue: 0 })
  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  salario?: number;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  fechaIngreso?: string;
}
