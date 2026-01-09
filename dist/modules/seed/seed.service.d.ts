import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserAuth } from '../users-auth/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../users-auth/entities/user-role.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UsuarioAuthMap } from '../users-auth/entities/usuario-auth-map.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Rubro } from '../rubros/entities/rubro.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { PuntoMudras } from '../puntos-mudras/entities/punto-mudras.entity';
export declare class SeedService implements OnModuleInit {
    private readonly userAuthRepo;
    private readonly roleRepo;
    private readonly userRoleRepo;
    private readonly usuarioRepo;
    private readonly usuarioAuthMapRepo;
    private readonly articuloRepo;
    private readonly rubroRepo;
    private readonly proveedorRepo;
    private readonly puntosMudrasRepo;
    private readonly logger;
    constructor(userAuthRepo: Repository<UserAuth>, roleRepo: Repository<Role>, userRoleRepo: Repository<UserRole>, usuarioRepo: Repository<Usuario>, usuarioAuthMapRepo: Repository<UsuarioAuthMap>, articuloRepo: Repository<Articulo>, rubroRepo: Repository<Rubro>, proveedorRepo: Repository<Proveedor>, puntosMudrasRepo: Repository<PuntoMudras>);
    onModuleInit(): Promise<void>;
    private seedPuntosMudras;
    private seedAdmin;
    private seedProducoDemo;
}
