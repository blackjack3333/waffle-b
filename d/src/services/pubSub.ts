import RedisPubSubProvider from './providers/pubsub/redis';

import { PubSubServiceProvider, MessageHandler, PubSubStatus, PubSubConfig } from '../interfaces/services/pubSub';

export class PubSubService implements PubSubServiceProvider {
    private readonly provider: RedisPubSubProvider;

    constructor(config: PubSubConfig, logger: Console) {
        this.provider = new RedisPubSubProvider(config, logger);
    }

    async subscribe(channel: string): Promise<number> {
        return this.provider.subscribe(channel);
    }

    async unsubscribe(channel: string): Promise<number> {
        return this.provider.unsubscribe(channel);
    }

    async publish(channel: string, data: unknown): Promise<number> {
        return this.provider.publish(channel, data);
    }

    onMessage(handler: MessageHandler): void {
        return this.provider.onMessage(handler);
    }

    getStatus(): PubSubStatus {
        return this.provider.getStatus();
    }
}
