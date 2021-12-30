export interface Config {
    [key: string]: any;
}

export declare class ConfigService {
    private static config: Config;

    constructor(config: Config);

    get(param: string): any;

    isLocal(): boolean;

    isTest(): boolean;

    isStage(): boolean;

    isDev(): boolean;

    isProd(): boolean;
}

export enum Env {
    Local = 'local',
    Test = 'test',
    Stage = 'stage',
    Dev = 'dev',
    Prod = 'prod'
}

export interface ReplicaSetNodeConfig {
    replicaHost: string;
}

export interface AppDbConfig {
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    authSource?: string;
    replicaSet?: string;
    replicaSetNodes?: ReplicaSetNodeConfig[];
    readPreference?: string;
}
