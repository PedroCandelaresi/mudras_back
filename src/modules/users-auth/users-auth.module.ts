import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuth } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';
import { UserRole } from './entities/user-role.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { Role } from '../roles/entities/role.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserAuth, UserProvider, UserRole, RefreshToken, Role])],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService],
})
export class UsersAuthModule { }
