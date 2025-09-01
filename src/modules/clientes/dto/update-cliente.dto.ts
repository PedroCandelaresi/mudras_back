import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CreateClienteDto } from './create-cliente.dto';

@InputType()
export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @Field({ nullable: true })
  @IsOptional()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  apellido?: string;

  @Field({ nullable: true })
  @IsOptional()
  razonSocial?: string;

  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  direccion?: string;
}
