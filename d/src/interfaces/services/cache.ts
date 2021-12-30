import { KeyType, ValueType } from 'ioredis';

import { CacheStatus } from './providers/cache/redis';
import { RedisConfig } from '../libs/redis';

export interface CacheProvider {
    get(key: KeyType): Promise<string | null>;
    set(key: KeyType, data: ValueType, expiration?: number): Promise<string>;
    getKeysByPattern(pattern: string): Promise<string[]>;
    getByKeys(keys: string[]): Promise<string[]>;
    remove(...key: string[]): Promise<number>;
    getStatus(): CacheStatus;
}

export declare class CacheService {
    constructor(config: RedisConfig, logger: Console);
    get(key: KeyType): Promise<string | null>;
    set(key: KeyType, data: ValueType, expiration?: number): Promise<string>;
    getKeysByPattern(pattern: string): Promise<string[]>;
    getByKeys(keys: string[]): Promise<string[]>;
    remove(...key: string[]): Promise<number>;
    getStatus(): CacheStatus;
}
