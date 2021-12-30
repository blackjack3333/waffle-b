import { Document } from 'mongoose';
import { ObjectId } from 'bson';

export enum AuthUrlTarget {
    Telegram = 'telegram'
}

export interface UserMetaData {
    appUserId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthUrl {
    target: AuthUrlTarget;
    key: string;
    userMetaData: UserMetaData;
    userId?: ObjectId;
    used?: Date;
}

export interface AuthUrlModel extends AuthUrl, Document {}
