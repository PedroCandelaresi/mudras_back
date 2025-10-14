import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosResolver } from './usuarios.resolver';
import { UsuariosAdminResolver } from './usuarios-admin.resolver';
import { Usuario } from './entities/usuario.entity';
import { UsersAuthModule } from '../users-auth/users-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), UsersAuthModule],
  providers: [UsuariosResolver, UsuariosAdminResolver, UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
