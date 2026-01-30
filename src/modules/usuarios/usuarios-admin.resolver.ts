import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../users-auth/users.service';
import {
  ActualizarUsuarioAuthInput,
  CrearUsuarioAuthInput,
  ListarUsuariosAuthInput,
  UsuarioAuthResumenModel,
  UsuariosAuthPaginadosModel,
} from './dto/usuarios-auth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permisos } from '../auth/decorators/permissions.decorator';
import { UsuariosService } from './usuarios.service';
import { RolUsuario, Usuario } from './entities/usuario.entity';
import { UsuarioCajaAuthModel } from './dto/usuarios-auth.dto';

@Resolver(() => UsuarioAuthResumenModel)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UsuariosAdminResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly usuariosGestionService: UsuariosService,
  ) { }

  @Roles('administrador')
  @Query(() => UsuariosAuthPaginadosModel, { name: 'usuariosAdmin' })
  listarUsuariosAdmin(
    @Args('filtros', { type: () => ListarUsuariosAuthInput, nullable: true }) filtros?: ListarUsuariosAuthInput,
  ) {
    return this.usersService.listar(filtros ?? {});
  }

  @Roles('administrador')
  @Query(() => UsuarioAuthResumenModel, { name: 'usuarioAdmin' })
  obtenerUsuarioAdmin(@Args('id', { type: () => String }) id: string) {
    return this.usersService.obtener(id);
  }

  @Roles('administrador')
  @Mutation(() => UsuarioAuthResumenModel, { name: 'crearUsuarioAdmin' })
  crearUsuarioAdmin(@Args('input', { type: () => CrearUsuarioAuthInput }) input: CrearUsuarioAuthInput) {
    return this.usersService.crear({
      username: input.username,
      email: input.email ?? null,
      displayName: input.displayName,
      passwordTemporal: input.passwordTemporal,
      isActive: input.isActive,
      roles: input.roles,
      userType: input.userType,
    });
  }

  @Roles('administrador')
  @Mutation(() => UsuarioAuthResumenModel, { name: 'actualizarUsuarioAdmin' })
  actualizarUsuarioAdmin(
    @Args('id', { type: () => String }) id: string,
    @Args('input', { type: () => ActualizarUsuarioAuthInput }) input: ActualizarUsuarioAuthInput,
  ) {
    return this.usersService.actualizar({
      id,
      email: input.email,
      displayName: input.displayName,
      isActive: input.isActive,
      roles: input.roles,
    });
  }

  @Roles('administrador')
  @Mutation(() => Boolean, { name: 'eliminarUsuarioAdmin' })
  eliminarUsuarioAdmin(@Args('id', { type: () => String }) id: string) {
    return this.usersService.eliminar(id);
  }

  @Roles('administrador')
  @Mutation(() => UsuarioAuthResumenModel, { name: 'asignarRolesUsuarioAdmin' })
  asignarRolesUsuarioAdmin(
    @Args('id', { type: () => String }) id: string,
    @Args('roles', { type: () => [String] }) roles: string[],
  ) {
    return this.usersService.asignarRoles(id, roles);
  }

  // Disponible para cualquier usuario EMPRESA con permiso de caja.read
  @Permisos('caja.read')
  @Query(() => [Usuario], { name: 'usuariosGestionPorRol' })
  async listarUsuariosGestionPorRol(@Args('rol', { type: () => RolUsuario }) rol: RolUsuario) {
    console.log('🛠️ [UsuariosAdminResolver] listarUsuariosGestionPorRol:start', { rol });
    try {
      // 1) Usuarios por rol interno en tabla `usuarios`
      const porRolInterno = await this.usuariosGestionService.findByRol(rol);

      // 2) Si el rol es CAJA, sumar también usuarios con rol auth `caja_registradora`
      let porRolAuth: Usuario[] = [];
      if (rol === RolUsuario.CAJA) {
        porRolAuth = await this.usuariosGestionService.findByAuthRolSlug('caja_registradora');
      }

      // Unificar por id evitando duplicados
      const mapa = new Map<number, Usuario>();
      for (const u of porRolInterno) mapa.set(u.id, u);
      for (const u of porRolAuth) mapa.set(u.id, u);
      const salida = Array.from(mapa.values()).sort((a, b) => `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`));

      console.log('🛠️ [UsuariosAdminResolver] listarUsuariosGestionPorRol:resultado', { rol, cantidad: salida?.length ?? 0 });
      return salida;
    } catch (error) {
      console.error('🛠️ [UsuariosAdminResolver] listarUsuariosGestionPorRol:error', { rol, error });
      throw error;
    }
  }

  // Nuevo listado de usuarios (solo mudras_auth_users) por rol slug (default: caja_registradora)
  @Permisos('caja.read')
  @Query(() => [UsuarioCajaAuthModel], { name: 'usuariosCajaAuth' })
  async usuariosCajaAuth(
    @Args('rolSlug', { type: () => String, nullable: true }) rolSlug?: string,
  ): Promise<UsuarioCajaAuthModel[]> {
    const users = await this.usersService.listarEmpresaPorRolSlug(rolSlug);
    return users.map((u) => ({ id: u.id, username: u.username, email: u.email, displayName: u.displayName }));
  }
}
