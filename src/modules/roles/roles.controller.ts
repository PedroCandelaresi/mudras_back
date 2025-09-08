import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { RolesService, CrearRolDto, ActualizarRolDto } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('administrador')
  listar() { return this.rolesService.listar(); }

  @Get('permissions')
  @Roles('administrador')
  listarPermisos() { return this.rolesService.listarPermisos(); }

  @Post()
  @Roles('administrador')
  crear(@Body() dto: CrearRolDto) { return this.rolesService.crear(dto); }

  @Put(':id')
  @Roles('administrador')
  actualizar(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: Omit<ActualizarRolDto, 'id'>) {
    return this.rolesService.actualizar({ id, ...dto });
  }

  @Delete(':id')
  @Roles('administrador')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) { return this.rolesService.eliminar(id); }

  @Post(':id/permissions')
  @Roles('administrador')
  asignarPermisos(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: { permissionIds: string[] }) {
    return this.rolesService.asignarPermisos(id, body.permissionIds || []);
  }
}
