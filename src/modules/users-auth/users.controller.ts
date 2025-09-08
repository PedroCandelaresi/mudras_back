import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService, CrearUsuarioDto, ActualizarUsuarioDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('administrador')
  listar(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    return this.usersService.listar(Number(pagina ?? 0), Number(limite ?? 20));
  }

  @Post()
  @Roles('administrador')
  crear(@Body() dto: CrearUsuarioDto) {
    return this.usersService.crear(dto);
  }

  @Get(':id')
  @Roles('administrador')
  obtener(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.obtener(id);
  }

  @Put(':id')
  @Roles('administrador')
  actualizar(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: Omit<ActualizarUsuarioDto, 'id'>) {
    return this.usersService.actualizar({ id, ...dto });
  }

  @Delete(':id')
  @Roles('administrador')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.eliminar(id);
  }

  @Post(':id/roles')
  @Roles('administrador')
  asignarRoles(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { roles: string[] },
  ) {
    return this.usersService.asignarRoles(id, body.roles || []);
  }
}
