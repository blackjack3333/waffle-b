import { KeyType, ValueType, Redis } from 'ioredis';

import redisService from '../../../libs/redis';

import { CacheProvider } from '../../../interfaces/services/cache';
import { CacheStatus } from '../../../interfaces/services/providers/cache/redis';
import { RedisConfig } from '../../../interfaces/libs/redis';

export default class RedisCacheProvider implements CacheProvider {
    private readonly defaultExpiration: number = 60 * 60 * 3; // 3 hours

    private clientRW: Redis;

    private clientRO: Redis;

    constructor({ readWrite, readOnly }: RedisConfig, private l: Console) {
        this.clientRW = redisService.createClient(readWrite);
        this.clientRO = redisService.createClient(readOnly);

        this.clientRW.on('connect', () => {
            this.l.info(`Redis READ-WRITE connection open to ${JSON.stringify(readWrite)}`);
        });

        this.clientRW.on('error', (err: Error) => {
            this.l.info('Redis READ-WRITE connection error ', err);
            this.l.info(`Redis Path ${JSON.stringify(readWrite)}`);
        });

        this.clientRO.on('connect', () => {
            this.l.info(`Redis READ-ONLY connection open to ${JSON.stringify(readOnly)}`);
        });

        this.clientRO.on('error', (err: Error) => {
            this.l.info('Redis READ-ONLY connection error ', err);
            this.l.info(`Redis Path ${JSON.stringify(readOnly)}`);
        });
    }

    async get(key: KeyType): Promise<string | null> {
        return this.clientRO.get(key);
    }

    async set(key: KeyType, data: ValueType, expiration: number = this.defaultExpiration): Promise<string> {
        const result: string = await this.clientRW.set(key, data);
        if (expiration !== -1) {
            await this.clientRW.expire(key, expiration);
        }

        return result;
    }

    async getKeysByPattern(pattern: string): Promise<string[]> {
        return this.clientRO.keys(pattern);
    }

    async getByKeys(keys: string[]): Promise<string[]> {
        return this.clientRO.mget(keys);
    }

    async remove(...key: string[]): Promise<number> {
        return this.clientRW.del(...key);
    }

    getStatus(): CacheStatus {
        return {
            readWrite: this.clientRW.status,
            readOnly: this.clientRO.status
        };
    }
}
