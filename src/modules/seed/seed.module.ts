import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { UserAuth } from '../users-auth/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../users-auth/entities/user-role.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UsuarioAuthMap } from '../users-auth/entities/usuario-auth-map.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Rubro } from '../rubros/entities/rubro.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { PuntoMudras } from '../puntos-mudras/entities/punto-mudras.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserAuth,
            Role,
            UserRole,
            Usuario,
            UsuarioAuthMap,
            Articulo,
            Rubro,
            Proveedor,
            PuntoMudras,
            Permission,
            RolePermission,
        ]),
    ],
    providers: [SeedService],
    exports: [SeedService],
})
export class SeedModule { }
