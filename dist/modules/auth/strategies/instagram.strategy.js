"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_oauth2_1 = require("passport-oauth2");
let InstagramStrategy = class InstagramStrategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, 'instagram') {
    constructor() {
        super({
            authorizationURL: 'https://api.instagram.com/oauth/authorize',
            tokenURL: 'https://api.instagram.com/oauth/access_token',
            clientID: process.env.INSTAGRAM_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
            callbackURL: process.env.INSTAGRAM_REDIRECT_URI,
        });
    }
    async userProfile(accessToken) {
        try {
            const resp = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
            if (!resp.ok)
                return null;
            const data = (await resp.json());
            return data;
        }
        catch {
            return null;
        }
    }
    async validate(accessToken, refreshToken, params) {
        const profile = await this.userProfile(accessToken);
        return {
            provider: 'instagram',
            providerUserId: profile?.id ?? 'unknown',
            email: null,
            displayName: profile?.username ? `instagram:${profile.username}` : `instagram:${profile?.id ?? 'user'}`,
            accessToken,
            refreshToken: refreshToken || null,
        };
    }
};
exports.InstagramStrategy = InstagramStrategy;
exports.InstagramStrategy = InstagramStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], InstagramStrategy);
//# sourceMappingURL=instagram.strategy.js.map