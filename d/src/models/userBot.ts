import { model, Schema } from 'mongoose';
import { ObjectId } from 'bson';

import { UserBotModel, UserBotType } from '../interfaces/models/userBot';

const userBotMetaDataSchema: Schema = new Schema(
    {
        username: { type: String },
        firstName: { type: String },
        lastName: { type: String }
    },
    {
        _id: false
    }
);

const userBotSchema: Schema = new Schema(
    {
        userId: { type: ObjectId, index: true, required: true },
        appUserId: { type: String, index: true, required: true },
        type: { type: String, index: true, enum: Object.values(UserBotType), required: true },
        metaData: { type: userBotMetaDataSchema, default: {}, requried: true }
    },
    {
        timestamps: true
    }
);

userBotSchema.index({ userId: 1, appUserId: 1, type: 1 }, { unique: true });

export default model<UserBotModel>('UserBot', userBotSchema);
