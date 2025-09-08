declare const InstagramStrategy_base: new (...args: [options: import("passport-oauth2").StrategyOptions] | [options: import("passport-oauth2").StrategyOptionsWithRequest]) => import("passport-oauth2") & {
    validate(...args: any[]): unknown;
};
export declare class InstagramStrategy extends InstagramStrategy_base {
    constructor();
    userProfile(accessToken: string): Promise<{
        id: string;
        username?: string;
    } | null>;
    validate(accessToken: string, refreshToken: string, params: any): Promise<any>;
}
export {};
