import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'bson';

import configService from './config';

import userBotService from './userBot';

import authUrlModel from '../models/authUrl';

import { AuthUrlSource } from '../interfaces/services/authUrl';
import { AuthUrlModel, AuthUrlTarget } from '../interfaces/models/authUrl';
import { UserBotType } from '../interfaces/models/userBot';
import { GetAuthUrlQueryParamsRequest } from '../interfaces/controllers/auth';

class AuthUrlService {
    private authUrlToAuthUrlSourceMap: Map<AuthUrlTarget, AuthUrlSource> = new Map([
        [AuthUrlTarget.Telegram, AuthUrlSource.Telegram]
    ]);

    private authUrlSourceToAuthUrlMap: Map<AuthUrlSource, AuthUrlTarget> = new Map([
        [AuthUrlSource.Telegram, AuthUrlTarget.Telegram]
    ]);


    async generateAuthUrlByTarget(target: AuthUrlTarget, queryParams: GetAuthUrlQueryParamsRequest): Promise<string> {
        const { appUserId, username, firstName, lastName } = queryParams;
        const authUrl: AuthUrlModel = await authUrlModel.create({
            target,
            key: uuidv4(),
            userMetaData: {
                appUserId,
                username,
                firstName,
                lastName
            }
        });

        const source: AuthUrlSource = this.authUrlToAuthUrlSourceMap.get(target);

        return `${configService.get('ui.baseUrl')}${configService.get('ui.loginPath')}?source=${source}&uid=${authUrl.key}`;
    }

    async connectBotWithUserAndNotifyBot(source: AuthUrlSource, uid: string, userId: ObjectId): Promise<void> {
        const target: AuthUrlTarget = this.authUrlSourceToAuthUrlMap.get(source);
        const authUrl: AuthUrlModel = await authUrlModel.findOne({
            key: uid,
            target,
            used: { $exists: false }
        });
        if (!authUrl) {
            return;
        }

        authUrl.used = new Date;
        await authUrl.save();

        await userBotService.connectBotWithUser(userId, authUrl.userMetaData, target);
    }
}

export default new AuthUrlService();
