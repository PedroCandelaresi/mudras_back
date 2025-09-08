import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CrearPermisoDto } from './dto/crear-permiso.dto';
import { ActualizarPermisoDto } from './dto/actualizar-permiso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Get()
  @Roles('administrador')
  listar() { return this.service.listar(); }

  @Post()
  @Roles('administrador')
  crear(@Body() dto: CrearPermisoDto) { return this.service.crear(dto); }

  @Put(':id')
  @Roles('administrador')
  actualizar(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: Omit<ActualizarPermisoDto, 'id'>) {
    return this.service.actualizar({ id, ...dto });
  }

  @Delete(':id')
  @Roles('administrador')
  eliminar(@Param('id', new ParseUUIDPipe()) id: string) { return this.service.eliminar(id); }
}
