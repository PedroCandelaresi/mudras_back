import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserAuth } from '../users-auth/entities/user.entity';
import { UserRole } from '../users-auth/entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { RefreshToken } from '../users-auth/entities/refresh-token.entity';
import { UserProvider } from '../users-auth/entities/user-provider.entity';
import { GoogleStrategy } from './strategies/google.strategy';
import { InstagramStrategy } from './strategies/instagram.strategy';

// Registrar estrategias OAuth solo si hay credenciales para evitar errores en dev
const oauthProviders = [] as any[];
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL
) {
  oauthProviders.push(GoogleStrategy);
}
if (
  process.env.INSTAGRAM_CLIENT_ID &&
  process.env.INSTAGRAM_CLIENT_SECRET &&
  process.env.INSTAGRAM_REDIRECT_URI
) {
  oauthProviders.push(InstagramStrategy);
}

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAuth, UserRole, Role, RolePermission, Permission, RefreshToken, UserProvider]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_me',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, ...oauthProviders],
  exports: [AuthService],
})
export class AuthModule {}
