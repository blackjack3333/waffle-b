import IORedis, { Redis } from 'ioredis';

import { RedisClientConfig } from '../interfaces/libs/redis';

class RedisService {
    createClient({ port, host, db, password, autoResubscribe }: RedisClientConfig): Redis {
        return new IORedis(port, host, { db, password, autoResubscribe });
    }
}

export default new RedisService();
