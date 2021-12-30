import configService from '../../config';

import { PubSubService } from '../../pubSub';

import { BotAction, BotNotifyData, BotProvider } from '../../../interfaces/services/providers/bots';
import { PubSubConfig } from '../../../interfaces/services/pubSub';
import { RedisClientConfig } from '../../../interfaces/libs/redis';

class TelegramBotProvider implements BotProvider {
    private pubSubService: PubSubService;

    private readonly botName: string = 'telergam';

    // TODO: Refactor: Should be instance of PubSub provider
    constructor() {
        const readWrite: RedisClientConfig = configService.get('redis.readWrite');
        const readOnly: RedisClientConfig = configService.get('redis.readOnly');
        const pubSubConfig: PubSubConfig = {
            readWrite,
            readOnly
        };

        this.pubSubService = new PubSubService(pubSubConfig, console);
    }

    async notify(appUserId: string, action: BotAction): Promise<boolean> {
        console.info(`Start notify ${this.botName} user`, { appUserId, action });
        const channel: string = this.generateChannelName();
        const data: BotNotifyData = { appUserId, action };

        await this.pubSubService.publish(channel, data);

        return true;
    }

    private generateChannelName(): string {
        return `api:${this.botName}`;
    }
}

export default new TelegramBotProvider();
