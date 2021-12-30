import { Document } from 'mongoose';

export interface User {
    email: string;
    firstName?: string;
    lastName?: string;
    nickName?: string;
    picture: string;
    externalUserIds: string[];
}

export interface UserModel extends User, Document {}
