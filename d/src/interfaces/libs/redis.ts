export interface RedisClientConfig {
    host: string;
    port: number;
    db: number;
    password?: string;
    autoResubscribe?: boolean;
}

export interface RedisConfig {
    readWrite: RedisClientConfig;
    readOnly: RedisClientConfig;
}
