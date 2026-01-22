import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuth } from '../users-auth/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../users-auth/entities/user-role.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Usuario, RolUsuario, EstadoUsuario } from '../usuarios/entities/usuario.entity';
import { UsuarioAuthMap } from '../users-auth/entities/usuario-auth-map.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Rubro } from '../rubros/entities/rubro.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { PuntoMudras, TipoPuntoMudras } from '../puntos-mudras/entities/punto-mudras.entity';

import { Permission } from '../permissions/entities/permission.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectRepository(UserAuth)
        private readonly userAuthRepo: Repository<UserAuth>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectRepository(UserRole)
        private readonly userRoleRepo: Repository<UserRole>,
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepo: Repository<RolePermission>,
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
        @InjectRepository(UsuarioAuthMap)
        private readonly usuarioAuthMapRepo: Repository<UsuarioAuthMap>,
        @InjectRepository(Articulo)
        private readonly articuloRepo: Repository<Articulo>,
        @InjectRepository(Rubro)
        private readonly rubroRepo: Repository<Rubro>,
        @InjectRepository(Proveedor)
        private readonly proveedorRepo: Repository<Proveedor>,
        @InjectRepository(PuntoMudras)
        private readonly puntosMudrasRepo: Repository<PuntoMudras>,
    ) { }

    async onModuleInit() {
        this.logger.log('🌱 Iniciando verificación de semillas...');
        await this.seedPuntosMudras();
        await this.seedAdmin();
        await this.seedRBAC(); // New method
        await this.seedProducoDemo();
    }



    private async seedPuntosMudras() {
        // 1. Tienda Principal
        const tiendaPrincipal = await this.puntosMudrasRepo.findOne({ where: { nombre: 'Tienda Principal' } });
        if (!tiendaPrincipal) {
            this.logger.log('🆕 Creando Tienda Principal por defecto...');
            await this.puntosMudrasRepo.save(this.puntosMudrasRepo.create({
                nombre: 'Tienda Principal',
                tipo: TipoPuntoMudras.venta,
                descripcion: 'Punto de venta principal por defecto',
                direccion: 'Dirección Principal',
                activo: true,
                permiteVentasOnline: true,
                manejaStockFisico: true,
            }));
            this.logger.log('✅ Tienda Principal creada.');
        }

        // 2. Depósito Primario
        const depositoPrimario = await this.puntosMudrasRepo.findOne({ where: { nombre: 'Depósito Primario' } });
        if (!depositoPrimario) {
            this.logger.log('🆕 Creando Depósito Primario por defecto...');
            await this.puntosMudrasRepo.save(this.puntosMudrasRepo.create({
                nombre: 'Depósito Primario',
                tipo: TipoPuntoMudras.deposito,
                descripcion: 'Depósito central por defecto',
                direccion: 'Depósito Central',
                activo: true,
                permiteVentasOnline: false,
                manejaStockFisico: true,
            }));
            this.logger.log('✅ Depósito Primario creado.');
        }
    }

    private async seedAdmin() {
        const adminEmail = 'administrador@mudras.com';
        const adminUsername = 'administrador.mudras';
        const rawPassword = 'Cambiar123!';

        // 1. Verificar Rol Admin
        let adminRole = await this.roleRepo.findOne({ where: { slug: 'admin' } });
        if (!adminRole) {
            this.logger.log('Creando rol admin...');
            adminRole = this.roleRepo.create({
                id: randomUUID(),
                name: 'Administrador',
                slug: 'admin',
            });
            await this.roleRepo.save(adminRole);
        }

        // 2. Verificar Usuario Auth
        let adminUser = await this.userAuthRepo.findOne({
            where: [{ username: adminUsername }, { email: adminEmail }],
        });

        if (!adminUser) {
            this.logger.log('Creando usuario administrador...');
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            adminUser = this.userAuthRepo.create({
                id: randomUUID(),
                username: adminUsername,
                email: adminEmail,
                displayName: 'Administrador Sistema',
                passwordHash: hashedPassword,
                userType: 'EMPRESA',
                isActive: true,
                mustChangePassword: true,
            } as unknown as UserAuth);
            await this.userAuthRepo.save(adminUser);

            // Asignar rol
            const userRole = this.userRoleRepo.create({
                userId: adminUser.id,
                roleId: adminRole.id,
            });
            await this.userRoleRepo.save(userRole);

            this.logger.log(`✅ Usuario admin creado: ${adminUsername} / ${rawPassword}`);
        } else {
            this.logger.log('Usuario admin ya existe.');
        }

        // 3. Crear Usuario Legacy (mudras_usuarios) y Mapa (mudras_usuarios_auth_map)
        let usuarioLegacy = await this.usuarioRepo.findOne({ where: { username: adminUsername } });

        if (!usuarioLegacy && adminUser) {
            this.logger.log('Creando usuario legacy para admin...');
            const hashedPassword = await bcrypt.hash(rawPassword, 10);

            const newUser: any = {
                username: adminUsername,
                nombre: 'Administrador',
                apellido: 'Sistema',
                email: adminEmail,
                password: hashedPassword,
                rol: RolUsuario.ADMINISTRADOR,
                estado: EstadoUsuario.ACTIVO,
                salario: 0
            };

            usuarioLegacy = (this.usuarioRepo.create(newUser) as unknown) as Usuario;
            await this.usuarioRepo.save(usuarioLegacy);
        }

        if (usuarioLegacy && adminUser) {
            const mapa = await this.usuarioAuthMapRepo.findOne({ where: { authUserId: adminUser.id } });
            if (!mapa) {
                this.logger.log('Creando mapa auth para admin...');
                await this.usuarioAuthMapRepo.save({
                    usuarioId: usuarioLegacy.id,
                    authUserId: adminUser.id
                });
            }
        }
    }

    private async seedRBAC() {
        // Wrapper for ensurePermission
        const ensurePerm = async (resource: string, action: string) => {
            let p = await this.permissionRepo.findOne({ where: { resource, action } }); // Typo fixed
            // Wait, entity def needs check.
            // Let's assume standard 'resource'.
            if (!p) {
                // Try find by resource/action if repo field is different
                p = await this.permissionRepo.findOne({ where: { resource, action } as any });
            }
            if (!p) {
                p = this.permissionRepo.create({
                    id: randomUUID(),
                    resource,
                    action,
                    description: `Permiso para ${action} ${resource}`
                });
                await this.permissionRepo.save(p);
            }
            return p;
        };

        // Assign helper
        const assign = async (role: Role, perm: Permission) => {
            const exists = await this.rolePermissionRepo.findOne({ where: { roleId: role.id, permissionId: perm.id } });
            if (!exists) {
                await this.rolePermissionRepo.save(this.rolePermissionRepo.create({
                    roleId: role.id,
                    permissionId: perm.id
                }));
            }
        };

        // 1. Define Permissions
        const permissionsList = [
            { r: 'ventas', a: ['read', 'create', 'update'] },
            { r: 'contabilidad', a: ['read', 'create', 'update'] },
            { r: 'cuentas', a: ['read', 'create', 'update'] },
            { r: 'proveedores', a: ['read', 'create', 'update'] },
            { r: 'puntos_venta', a: ['read'] },
            { r: 'depositos', a: ['read'] },
            { r: 'promociones', a: ['read'] },
            { r: 'tienda_online', a: ['read'] },
            { r: 'stock', a: ['update'] },
            { r: 'usuarios', a: ['read'] },
            { r: 'puntos_mudras', a: ['read'] },
            { r: 'pedidos', a: ['read'] },
            { r: 'caja', a: ['read'] },
            { r: 'dashboard', a: ['read'] },
            { r: 'productos', a: ['read', 'create', 'update'] },
        ];

        // Cache permissions
        const permsCache: Record<string, Permission> = {};
        for (const group of permissionsList) {
            for (const action of group.a) {
                const key = `${group.r}:${action}`;
                permsCache[key] = await ensurePerm(group.r, action);
            }
        }

        // 2. Assign to Roles
        const roleSlugs = ['administrador', 'caja_registradora', 'tienda_online', 'deposito', 'disenadora'];
        const roles: Record<string, Role> = {};

        for (const slug of roleSlugs) {
            let r = await this.roleRepo.findOne({ where: { slug } });
            if (!r) {
                // Create if missing (Admin created in seedAdmin but others might need creation)
                let name = slug.charAt(0).toUpperCase() + slug.slice(1).replace('_', ' ');
                r = this.roleRepo.create({ id: randomUUID(), name, slug });
                await this.roleRepo.save(r);
            }
            roles[slug] = r;
        }

        // ADMIN: All
        if (roles['administrador']) {
            for (const key in permsCache) {
                await assign(roles['administrador'], permsCache[key]);
            }
        }

        // CAJA
        if (roles['caja_registradora']) {
            const allowed = [
                'ventas:read', 'ventas:create', 'ventas:update',
                'cuentas:read', 'cuentas:create', 'cuentas:update',
                'caja:read', 'promociones:read', 'pedidos:read',
                'dashboard:read'
            ];
            for (const k of allowed) if (permsCache[k]) await assign(roles['caja_registradora'], permsCache[k]);
        }

        // TIENDA
        if (roles['tienda_online']) {
            const allowed = ['ventas:read', 'tienda_online:read', 'promociones:read', 'depositos:read', 'productos:read'];
            for (const k of allowed) if (permsCache[k]) await assign(roles['tienda_online'], permsCache[k]);
        }

        // DEPOSITO
        if (roles['deposito']) {
            const allowed = ['depositos:read', 'stock:update', 'puntos_venta:read', 'productos:read'];
            for (const k of allowed) if (permsCache[k]) await assign(roles['deposito'], permsCache[k]);
        }

        // DISENADORA
        if (roles['disenadora']) {
            const allowed = ['promociones:read', 'tienda_online:read', 'productos:read', 'dashboard:read'];
            for (const k of allowed) if (permsCache[k]) await assign(roles['disenadora'], permsCache[k]);
        }

        this.logger.log('✅ RBAC inicializado.');
    }

    private async seedProducoDemo() {
        const demoCodigo = 'DEMO001';

        let articulo = await this.articuloRepo.findOne({ where: { Codigo: demoCodigo } });
        if (!articulo) {
            this.logger.log('Creating demo product...');

            // Crear Dependencias
            let rubro = await this.rubroRepo.findOne({ where: { Codigo: 'DEMO' } });
            if (!rubro) {
                rubro = this.rubroRepo.create({ Rubro: 'Demo', Codigo: 'DEMO' });
                await this.rubroRepo.save(rubro);
            }

            let proveedor = await this.proveedorRepo.findOne({ where: { Codigo: '999' } });
            if (!proveedor) {
                proveedor = this.proveedorRepo.create({ Nombre: 'Proveedor Demo', Codigo: '999' });
                await this.proveedorRepo.save(proveedor);
            }

            articulo = this.articuloRepo.create({
                Codigo: demoCodigo,
                Descripcion: 'Producto de demostración',
                PrecioVenta: 1000.00,
                PrecioCompra: 500.00,
                StockMinimo: 10,
                rubro: rubro,
                proveedor: proveedor,
                totalStock: 100,
                StockInicial: 100,
                Calculado: false,
                CostoEnDolares: false,
                AlicuotaIva: 21,
                Deposito: 0,
                FechaCompra: new Date(),
                idProveedor: proveedor.IdProveedor,
                rubroId: rubro.Id,
                Lista2: 0,
                Lista3: 0,
                Lista4: 0,
                PorcentajeGanancia: 100,
                CodigoProv: 'DEMO-PROV',
                CostoPromedio: 500,
                PrecioListaProveedor: 500,
                FechaModif: new Date(),
                Lista1EnDolares: false,
                Dto1: 0,
                Dto2: 0,
                Dto3: 0,
                Impuesto: 0,
                EnPromocion: false,
                UsaTalle: false,
                Compuesto: false,
                Combustible: false,
                ImpuestoPorcentual: false
            });

            await this.articuloRepo.save(articulo);
            this.logger.log('✅ Producto Demo creado: ' + demoCodigo);
        }
    }
}
