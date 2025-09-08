import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserAuth } from '../../users-auth/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password', passReqToCallback: false });
  }

  async validate(username: string, password: string): Promise<UserAuth> {
    return this.authService.validateUser(username, password);
  }
}
