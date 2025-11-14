import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserAuth } from '../users-auth/entities/user.entity';
import { UserRole } from '../users-auth/entities/user-role.entity';
import { RefreshToken } from '../users-auth/entities/refresh-token.entity';
import { randomUUID } from 'crypto';
import { Role } from '../roles/entities/role.entity';
import { UserProvider } from '../users-auth/entities/user-provider.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';

export interface JwtPayload {
  sub: string; // user id (auth UUID)
  username: string | null;
  roles: string[];
  typ: 'EMPRESA' | 'CLIENTE';
  perms: string[];
  // uid: ID numérico del usuario interno (tabla `usuarios`), cuando existe mapeo
  uid?: number;
}

function parseDurationMs(input: string): number {
  // soporta sufijos: ms, s, m, h, d
  const match = String(input).trim().match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!match) return Number(input) || 0;
  const value = Number(match[1]);
  const unit = (match[2] || 'ms').toLowerCase();
  switch (unit) {
    case 'ms': return value;
    case 's': return value * 1000;
    case 'm': return value * 60_000;
    case 'h': return value * 3_600_000;
    case 'd': return value * 86_400_000;
    default: return value;
  }
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAuth) private readonly usersRepo: Repository<UserAuth>,
    @InjectRepository(UserRole) private readonly userRolesRepo: Repository<UserRole>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
    @InjectRepository(UserProvider) private readonly providersRepo: Repository<UserProvider>,
    @InjectRepository(RefreshToken) private readonly refreshRepo: Repository<RefreshToken>,
    @InjectRepository(RolePermission) private readonly rolePermRepo: Repository<RolePermission>,
    @InjectRepository(Permission) private readonly permsRepo: Repository<Permission>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, plainPassword: string): Promise<UserAuth> {
    // Para login de EMPRESA debe ser usuario estilo nombre.apellido (no email)
    const isEmail = /@/.test(username || '');
    if (isEmail) {
      throw new UnauthorizedException('Para clientes usa /cliente y Google/Instagram');
    }
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user || !user.isActive || user.userType !== 'EMPRESA') {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.passwordHash) {
      throw new UnauthorizedException('Usuario sin contraseña local');
    }
    const ok = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  async validateClientEmail(email: string, plainPassword: string): Promise<UserAuth> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || !user.isActive || user.userType !== 'CLIENTE') {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.passwordHash) {
      throw new UnauthorizedException('Usuario sin contraseña local');
    }
    const ok = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Asegurar que tenga rol cliente asignado
    const roles = await this.getUserRolesSlugs(user.id);
    if (!roles.includes('cliente')) {
      const rolCliente = await this.rolesRepo.findOne({ where: { slug: 'cliente' } });
      if (rolCliente) {
        await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: rolCliente.id }));
      }
    }
    return user;
  }

  async getUserRolesSlugs(userId: string): Promise<string[]> {
    const rows = await this.userRolesRepo.find({ where: { userId }, relations: ['role'] });
    return rows.map((r) => r.role.slug);
  }

  async obtenerPermisosEfectivos(userId: string): Promise<string[]> {
    const userRoles = await this.userRolesRepo.find({ where: { userId } });
    const roleIds = userRoles.map((ur) => ur.roleId);
    if (roleIds.length === 0) return [];
    const rolePerms = await this.rolePermRepo.find({ where: { roleId: In(roleIds) }, relations: ['permission'] });
    const set = new Set<string>();
    for (const rp of rolePerms) {
      if (rp.permission) set.add(`${rp.permission.resource}.${rp.permission.action}`);
    }
    const roles = await this.getUserRolesSlugs(userId);
    if (roles.includes('administrador')) set.add('*');
    return Array.from(set);
  }

  private async obtenerUsuarioInternoId(authUserId: string): Promise<number | undefined> {
    // Busca el id numérico en la tabla de mapeo si existe
    try {
      const rows = await this.usersRepo.query(
        'SELECT usuario_id AS usuarioId FROM usuarios_auth_map WHERE auth_user_id = ? LIMIT 1',
        [authUserId],
      );
      const id = rows?.[0]?.usuarioId;
      if (typeof id === 'number' && Number.isFinite(id)) return id;
      if (id != null) {
        const n = Number(id);
        return Number.isFinite(n) ? n : undefined;
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  async emitirTokens(user: UserAuth): Promise<{ accessToken: string; refreshToken: string }> {
    const roles = await this.getUserRolesSlugs(user.id);
    const perms = await this.obtenerPermisosEfectivos(user.id);
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      roles,
      typ: user.userType,
      perms,
    };
    // Adjuntar uid (id numérico de `usuarios`) si existe mapeo
    const uid = await this.obtenerUsuarioInternoId(user.id);
    if (uid) payload.uid = uid;
    const accessToken = await this.jwtService.signAsync(payload);

    // Crear refresh token opaco y guardar hash
    const opaque = randomUUID();
    const tokenHash = await bcrypt.hash(opaque, 10);
    const refresh = this.refreshRepo.create({
      id: randomUUID(),
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + parseDurationMs(process.env.JWT_REFRESH_EXPIRES_IN || '7d')),
      revoked: false,
    } as unknown as RefreshToken);
    await this.refreshRepo.save(refresh);

    return { accessToken, refreshToken: opaque };
  }

  async refrescarTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Buscar token válido (comparando hashes)
    const rows = await this.refreshRepo.find({ where: { revoked: false } });
    let match: RefreshToken | null = null;
    for (const row of rows) {
      const ok = await bcrypt.compare(refreshToken, row.tokenHash);
      if (ok) { match = row; break; }
    }
    if (!match || match.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token inválido');
    }
    const user = await this.usersRepo.findOne({ where: { id: match.userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario inválido');
    }
    // Rotación de refresh token: revocar el usado
    match.revoked = true;
    await this.refreshRepo.save(match);
    return this.emitirTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    const rows = await this.refreshRepo.find({ where: { revoked: false } });
    for (const row of rows) {
      const ok = await bcrypt.compare(refreshToken, row.tokenHash);
      if (ok) {
        row.revoked = true;
        await this.refreshRepo.save(row);
        break;
      }
    }
  }

  async handleOAuthLogin(input: {
    provider: 'google' | 'instagram';
    providerUserId: string;
    email: string | null;
    displayName: string;
    accessToken: string;
    refreshToken: string | null;
  }): Promise<{ accessToken: string; refreshToken: string; user: UserAuth }> {
    // Bloquear si el email corresponde a un usuario interno EMPRESA
    if (input.email) {
      const interno = await this.usersRepo.findOne({ where: { email: input.email } });
      if (interno && interno.userType === 'EMPRESA') {
        throw new UnauthorizedException('El email pertenece a un usuario interno');
      }
    }

    // Buscar si ya existe vínculo provider
    let provider = await this.providersRepo.findOne({ where: { provider: input.provider, providerUserId: input.providerUserId } as any });
    let user: UserAuth | null = null;
    if (provider) {
      user = await this.usersRepo.findOne({ where: { id: provider.userId } });
    }

    if (!user) {
      // Crear usuario CLIENTE si no existe
      user = this.usersRepo.create({
        id: randomUUID(),
        username: null,
        email: input.email,
        displayName: input.displayName,
        userType: 'CLIENTE',
        mustChangePassword: false,
        isActive: true,
        passwordHash: null,
      } as unknown as UserAuth);
      await this.usersRepo.save(user);

      // Asignar rol CLIENTE
      const rolCliente = await this.rolesRepo.findOne({ where: { slug: 'cliente' } });
      if (rolCliente) {
        await this.userRolesRepo.save(this.userRolesRepo.create({ userId: user.id, roleId: rolCliente.id }));
      }
    }

    // Crear/actualizar vínculo provider
    if (!provider) {
      provider = this.providersRepo.create({
        id: randomUUID(),
        userId: user.id,
        provider: input.provider,
        providerUserId: input.providerUserId,
        email: input.email,
        accessToken: input.accessToken,
        refreshToken: input.refreshToken,
      } as unknown as UserProvider);
    } else {
      provider.email = input.email;
      provider.accessToken = input.accessToken;
      provider.refreshToken = input.refreshToken;
    }
    await this.providersRepo.save(provider);

    const tokens = await this.emitirTokens(user);
    return { ...tokens, user };
  }
}
