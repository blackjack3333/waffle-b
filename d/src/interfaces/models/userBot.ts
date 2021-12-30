import { Document } from 'mongoose';
import { ObjectId } from 'bson';

export enum UserBotType {
    Telegram = 'telegram'
}

export interface UserBotMetaData {
    username?: string;
    firstName?: string;
    lastName?: string;
}

export interface UserBot {
    userId: ObjectId;
    appUserId: string;
    type: UserBotType;
    metaData: UserBotMetaData;
}

export interface UserBotModel extends UserBot, Document {}
