import { RedisConfig } from '../libs/redis';

export interface PubSubStatus {
    pub: string;
    sub: string;
}

export type MessageHandler = (channel: string, message: string) => unknown;

export declare class PubSubServiceProvider {
    constructor(config: RedisConfig, logger: Console);
    getStatus(): PubSubStatus;
    subscribe(channel: string): Promise<number>;
    unsubscribe(channel: string): Promise<number>
    publish(channel: string, data: unknown): Promise<number>;
    onMessage(handler: MessageHandler): void;
}

export type PubSubConfig = RedisConfig;
