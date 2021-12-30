export enum BotAction {
    LoggedIn = 'logged-in'
}

export interface BotNotifyData {
    appUserId: string;
    action: BotAction;
}

export interface BotProvider {
    notify(appUserId: string, action: BotAction): Promise<boolean>;
}
