import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

@InputType()
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @Field({ nullable: true })
  @IsOptional()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  apellido?: string;

  @Field({ nullable: true })
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  password?: string;
}
