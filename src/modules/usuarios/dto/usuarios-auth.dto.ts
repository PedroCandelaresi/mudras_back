import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

@InputType()
export class ListarUsuariosAuthInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  pagina?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limite?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  busqueda?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  estado?: string;
}

@ObjectType()
export class UsuarioAuthResumenModel {
  @Field()
  id!: string;

  @Field({ nullable: true })
  username!: string | null;

  @Field({ nullable: true })
  email!: string | null;

  @Field()
  displayName!: string;

  @Field()
  userType!: 'EMPRESA' | 'CLIENTE';

  @Field()
  isActive!: boolean;

  @Field()
  mustChangePassword!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => [String])
  roles!: string[];
}

@ObjectType()
export class UsuariosAuthPaginadosModel {
  @Field(() => [UsuarioAuthResumenModel])
  items!: UsuarioAuthResumenModel[];

  @Field(() => Int)
  total!: number;
}

@ObjectType()
export class UsuarioCajaAuthModel {
  @Field()
  id!: string;

  @Field({ nullable: true })
  username?: string | null;

  @Field({ nullable: true })
  email?: string | null;

  @Field()
  displayName!: string;
}

@InputType()
export class CrearUsuarioAuthInput {
  @Field()
  username!: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  displayName!: string;

  @Field()
  passwordTemporal!: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field({ nullable: true })
  userType?: 'EMPRESA' | 'CLIENTE';
}

@InputType()
export class ActualizarUsuarioAuthInput {
  @Field({ nullable: true })
  email?: string | null;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => [String], { nullable: true })
  roles?: string[];
}
