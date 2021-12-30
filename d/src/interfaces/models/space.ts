import { Document } from 'mongoose';
import { ObjectId } from 'bson';

export interface Space {
    userId: ObjectId;
    userBotId: ObjectId;
    hashId: string;
}

export interface SpaceModel extends Space, Document {}
