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
    ) { }

    async onModuleInit() {
        this.logger.log('🌱 Iniciando verificación de semillas...');
        await this.seedAdmin();
        await this.seedProducoDemo();
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

            let proveedor = await this.proveedorRepo.findOne({ where: { Codigo: 999 } });
            if (!proveedor) {
                proveedor = this.proveedorRepo.create({ Nombre: 'Proveedor Demo', Codigo: 999 });
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
