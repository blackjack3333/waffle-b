import { AuthenticationClient, ManagementClient } from 'auth0';

import configService from './config';

import { CacheService } from './cache';

import { Auth0UserProfile } from '../interfaces/services/auth0';

class Auth0Service {
    private auth0Client: AuthenticationClient;

    private cacheService: CacheService;

    constructor() {
        // const management: ManagementClient = new ManagementClient({
        //     token: '{YOUR_API_V2_TOKEN}',
        //     domain: '{YOUR_ACCOUNT}.auth0.com'
        // });
        this.initClient();

        this.cacheService = new CacheService(configService.get('redis'), console);
    }

    async getProfile(accessToken: string): Promise<Auth0UserProfile> {
        const userProfileCacheJson: string = await this.cacheService.get(accessToken);
        if (userProfileCacheJson) {
            return JSON.parse(userProfileCacheJson);
        }

        const userProfile: Auth0UserProfile = await this.auth0Client.getProfile(accessToken);

        await this.cacheService.set(accessToken, JSON.stringify(userProfile));

        return userProfile;
    }

    private initClient(): void {
        this.auth0Client = new AuthenticationClient({
            // TODO: Remove hardcode, remove old auth0 config
            domain: 'dev-mykhalkiv.eu.auth0.com',
            clientId: configService.get('auth0.clientId')
        });
    }
}

export default new Auth0Service();
