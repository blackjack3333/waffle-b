import { KeyType, ValueType } from 'ioredis';

import RedisCacheProvider from './providers/cache/redis';

import { CacheProvider } from '../interfaces/services/cache';
import { CacheStatus } from '../interfaces/services/providers/cache/redis';
import { RedisConfig } from '../interfaces/libs/redis';

export class CacheService implements CacheProvider {
    private readonly provider: CacheProvider;

    constructor(config: RedisConfig, logger: Console) {
        this.provider = new RedisCacheProvider(config, logger);
    }

    async get(key: KeyType): Promise<string | null> {
        return this.provider.get(key);
    }

    async set(key: KeyType, data: ValueType, expiration?: number): Promise<string> {
        return this.provider.set(key, data, expiration);
    }

    async getKeysByPattern(pattern: string): Promise<string[]> {
        return this.provider.getKeysByPattern(pattern);
    }

    async getByKeys(keys: string[]): Promise<string[]> {
        return this.provider.getByKeys(keys);
    }

    async remove(key: string): Promise<number> {
        return this.provider.remove(key);
    }

    getStatus(): CacheStatus {
        return this.provider.getStatus();
    }
}
