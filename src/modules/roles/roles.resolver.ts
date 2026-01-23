import { Resolver, Query, Mutation, Args, Field, ObjectType } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CrearRolInput, ActualizarRolInput } from './dto/role.inputs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ObjectType()
export class RolePublic {
    @Field()
    id!: string;

    @Field()
    nombre!: string; // Aliased from name

    @Field()
    slug!: string;
}

@ObjectType()
export class PermissionPublic {
    @Field()
    id!: string;

    @Field()
    resource!: string;

    @Field()
    action!: string;

    @Field({ nullable: true })
    attributes!: string;
}

@Resolver(() => RolePublic)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class RolesResolver {
    constructor(private readonly rolesService: RolesService) { }

    @Query(() => [RolePublic], { name: 'roles' })
    @Roles('administrador')
    async roles() {
        const all = await this.rolesService.listar();
        return all.map((r) => ({
            id: r.id,
            nombre: r.name, // Map name to nombre
            slug: r.slug,
        }));
    }

    @Query(() => [PermissionPublic], { name: 'permisos' })
    @Roles('administrador')
    async permisos() {
        return this.rolesService.listarPermisos();
    }

    @Mutation(() => RolePublic, { name: 'crearRol' })
    @Roles('administrador')
    async crearRol(@Args('input') input: CrearRolInput) {
        const r = await this.rolesService.crear(input);
        return {
            id: r.id,
            nombre: r.name,
            slug: r.slug,
        };
    }

    @Mutation(() => RolePublic, { name: 'actualizarRol' })
    @Roles('administrador')
    async actualizarRol(@Args('input') input: ActualizarRolInput) {
        const r = await this.rolesService.actualizar(input);
        return {
            id: r.id,
            nombre: r.name,
            slug: r.slug,
        };
    }

    @Mutation(() => Boolean, { name: 'eliminarRol' })
    @Roles('administrador')
    async eliminarRol(@Args('id') id: string) {
        return this.rolesService.eliminar(id);
    }

    @Mutation(() => Boolean, { name: 'asignarPermisosRol' })
    @Roles('administrador')
    async asignarPermisosRol(
        @Args('id') id: string,
        @Args('permissions', { type: () => [String] }) permissions: string[],
    ) {
        const result = await this.rolesService.asignarPermisos(id, permissions);
        return result.ok;
    }
}
