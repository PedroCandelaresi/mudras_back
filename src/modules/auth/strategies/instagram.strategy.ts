import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor() {
    super({
      authorizationURL: 'https://api.instagram.com/oauth/authorize',
      tokenURL: 'https://api.instagram.com/oauth/access_token',
      clientID: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
      callbackURL: process.env.INSTAGRAM_REDIRECT_URI!,
    });
  }

  async userProfile(accessToken: string): Promise<{ id: string; username?: string } | null> {
    try {
      const resp = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
      if (!resp.ok) return null;
      const data = (await resp.json()) as { id: string; username?: string };
      return data;
    } catch {
      return null;
    }
  }

  async validate(accessToken: string, refreshToken: string, params: any): Promise<any> {
    const profile = await this.userProfile(accessToken);
    return {
      provider: 'instagram' as const,
      providerUserId: profile?.id ?? 'unknown',
      email: null,
      displayName: profile?.username ? `instagram:${profile.username}` : `instagram:${profile?.id ?? 'user'}`,
      accessToken,
      refreshToken: refreshToken || null,
    };
  }
}
