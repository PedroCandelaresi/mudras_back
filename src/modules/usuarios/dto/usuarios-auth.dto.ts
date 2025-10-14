import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class ListarUsuariosAuthInput {
  @Field(() => Int, { nullable: true })
  pagina?: number;

  @Field(() => Int, { nullable: true })
  limite?: number;

  @Field({ nullable: true })
  busqueda?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  nombre?: string;

  @Field({ nullable: true })
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
