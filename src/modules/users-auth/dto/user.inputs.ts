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
    email?: string;

    @Field({ nullable: true })
    displayName?: string;

    @Field({ nullable: true })
    isActive?: boolean;

    @Field(() => [String], { nullable: true })
    roles?: string[];
}

@ObjectType()
export class UserAdmin {
    @Field()
    id!: string;

    @Field({ nullable: true })
    username?: string;

    @Field({ nullable: true })
    email?: string;

    @Field()
    displayName!: string;

    @Field()
    userType!: string;

    @Field()
    isActive!: boolean;

    @Field()
    mustChangePassword!: boolean;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;

    @Field(() => [String], { nullable: 'items' })
    roles!: string[];
}

@ObjectType()
export class UserAdminResponse {
    @Field(() => Int)
    total!: number;

    @Field(() => [UserAdmin])
    items!: UserAdmin[];
}
