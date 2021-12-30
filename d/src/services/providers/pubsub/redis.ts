import { Redis } from 'ioredis';

import redisService from '../../../libs/redis';

import { MessageHandler, PubSubServiceProvider, PubSubStatus } from '../../../interfaces/services/pubSub';
import { RedisConfig } from '../../../interfaces/libs/redis';

export default class PubSubProvider implements PubSubServiceProvider {
    private pub: Redis;

    private sub: Redis;

    constructor({ readWrite, readOnly }: RedisConfig, private l: Console) {
        this.pub = redisService.createClient(readWrite);
        this.sub = redisService.createClient({ ...readOnly, autoResubscribe: true });

        this.pub.on('connect', () => {
            this.l.info(`Redis READ-WRITE pub connection open to ${JSON.stringify(readWrite)}`);
        });

        this.pub.on('error', (err: Error) => {
            this.l.info('Redis READ-WRITE pub connection error ', err);
            this.l.info(`Redis Path ${JSON.stringify(readWrite)}`);
        });

        this.sub.on('connect', () => {
            this.l.info(`Redis READ-ONLY sub connection open to ${JSON.stringify(readOnly)}`);
        });

        this.sub.on('error', (err: Error) => {
            this.l.info('Redis READ-ONLY sub connection error ', err);
            this.l.info(`Redis Path ${JSON.stringify(readOnly)}`);
        });
    }

    async subscribe(channel: string): Promise<number> {
        return this.sub.subscribe(channel);
    }

    async unsubscribe(channel: string): Promise<number> {
        return this.sub.unsubscribe(channel);
    }

    async publish(channel: string, data: unknown): Promise<number> {
        return this.pub.publish(channel, JSON.stringify(data));
    }

    onMessage(handler: MessageHandler): void {
        this.sub.on('message', handler);
    }

    getStatus(): PubSubStatus {
        return {
            pub: this.pub.status,
            sub: this.sub.status
        };
    }
}
