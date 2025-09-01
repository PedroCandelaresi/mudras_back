import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsuariosService } from './usuarios.service';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { RequireSecretKey } from '../../common/decorators/secret-key.decorator';

@Resolver(() => Usuario)
@RequireSecretKey()
export class UsuariosResolver {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Mutation(() => Usuario)
  createUsuario(@Args('createUsuarioInput') createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Query(() => [Usuario], { name: 'usuarios' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Query(() => Usuario, { name: 'usuario' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Query(() => [Usuario], { name: 'usuariosPorRol' })
  findByRol(@Args('rol', { type: () => RolUsuario }) rol: RolUsuario) {
    return this.usuariosService.findByRol(rol);
  }

  @Mutation(() => Usuario)
  updateUsuario(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUsuarioInput') updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Mutation(() => Boolean)
  async removeUsuario(@Args('id', { type: () => Int }) id: number) {
    await this.usuariosService.remove(id);
    return true;
  }

  @Mutation(() => Usuario)
  login(@Args('loginInput') loginDto: LoginDto) {
    return this.usuariosService.login(loginDto);
  }

  @Mutation(() => Boolean)
  async crearUsuariosEjemplo() {
    await this.usuariosService.createUsuariosEjemplo();
    return true;
  }
}
