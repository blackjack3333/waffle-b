import { ObjectId } from 'bson';

import spaceService from './space';

import telegramBotProvider from './providers/bots/telegram';

import userBotModel from '../models/userBot';

import { UserBotType, UserBotModel } from '../interfaces/models/userBot';
import { ModelNotFoundError } from '../errors/ModelNotFoundError';
import { UserBotNamesMap } from '../interfaces/services/userBot';
import { AuthUrlTarget, UserMetaData } from '../interfaces/models/authUrl';
import { BotAction, BotProvider } from '../interfaces/services/providers/bots';

class UserBotService {
    private authUrlToBotTypeMap: Map<AuthUrlTarget, UserBotType> = new Map([
        [AuthUrlTarget.Telegram, UserBotType.Telegram]
    ]);

    private botProviders: Map<AuthUrlTarget, BotProvider> = new Map([
        [AuthUrlTarget.Telegram, telegramBotProvider]
    ]);

    async connectBotWithUser(userId: ObjectId, userMetaData: UserMetaData, authUrlTarget: AuthUrlTarget): Promise<void> {
        const type: UserBotType = this.authUrlToBotTypeMap.get(authUrlTarget);

        const { appUserId, username, firstName, lastName } = userMetaData;
        const userBot: UserBotModel = await userBotModel.findOne({ userId, appUserId, type });
        if (userBot) {
            return;
        }

        console.log('Start connect user with bot', { userId, appUserId, type });

        const newUserBot: UserBotModel = await userBotModel.create({
            userId,
            appUserId,
            type,
            metaData: { username, firstName, lastName }
        });

        await spaceService.create(userId, newUserBot._id);

        const botProvider: BotProvider = this.botProviders.get(authUrlTarget);

        await botProvider.notify(userMetaData.appUserId, BotAction.LoggedIn);
    }

    async getUserBotByAppUserIdAndBotType(appUserId: string, type: UserBotType): Promise<UserBotModel> {
        const userBot: UserBotModel = await userBotModel.findOne({ appUserId, type });
        if (!userBot) {
            throw new ModelNotFoundError(userBotModel.modelName, `${appUserId}:${type}`);
        }

        return userBot;
    }

    async getUserBotNamesByUserId(userId: ObjectId): Promise<UserBotNamesMap> {
        const userBots: UserBotModel[] = await userBotModel.find({ userId });

        const userBotNamesMap: UserBotNamesMap = new Map();

        userBots.forEach((userBot: UserBotModel) => userBotNamesMap.set(userBot._id.toHexString(), this.generateUserBotName(userBot)));

        return userBotNamesMap;
    }

    private generateUserBotName(userBot: UserBotModel): string {
        const { appUserId, metaData: { username, firstName, lastName } } = userBot;

        if (username) {
            return username;
        }

        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        }

        return appUserId;
    }
}

export default new UserBotService();
