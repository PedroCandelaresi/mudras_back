import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['profile', 'email'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const emails = profile.emails?.[0]?.value || null;
    return {
      provider: 'google' as const,
      providerUserId: profile.id,
      email: emails,
      displayName: profile.displayName || emails || `google:${profile.id}`,
      accessToken: _accessToken,
      refreshToken: _refreshToken || null,
    };
  }
}
