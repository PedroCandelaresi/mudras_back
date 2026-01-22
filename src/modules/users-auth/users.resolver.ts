import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
    UserAdmin,
    UserAdminResponse,
    ListarUsuariosAuthInput,
    CrearUsuarioAuthInput,
    ActualizarUsuarioAuthInput,
} from './dto/user.inputs';

@Resolver(() => UserAdmin)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query(() => UserAdminResponse, { name: 'usuariosAdmin' })
    async usuariosAdmin(
        @Args('filtros', { type: () => ListarUsuariosAuthInput, nullable: true })
        filtros?: ListarUsuariosAuthInput,
    ) {
        return this.usersService.listar(filtros);
    }

    @Mutation(() => UserAdmin, { name: 'crearUsuarioAdmin' })
    async crearUsuarioAdmin(
        @Args('input') input: CrearUsuarioAuthInput,
    ) {
        return this.usersService.crear(input);
    }

    @Mutation(() => UserAdmin, { name: 'actualizarUsuarioAdmin' })
    async actualizarUsuarioAdmin(
        @Args('id') id: string,
        @Args('input') input: ActualizarUsuarioAuthInput,
    ) {
        return this.usersService.actualizar({ id, ...input });
    }

    @Mutation(() => Boolean, { name: 'eliminarUsuarioAdmin' })
    async eliminarUsuarioAdmin(@Args('id') id: string) {
        return this.usersService.eliminar(id);
    }

    @Mutation(() => UserAdmin, { name: 'asignarRolesUsuarioAdmin' })
    async asignarRolesUsuarioAdmin(
        @Args('id') id: string,
        @Args('roles', { type: () => [String] }) roles: string[],
    ) {
        return this.usersService.asignarRoles(id, roles);
    }
}
