import { model, Schema } from 'mongoose';
import { ObjectId } from 'bson';

import { AuthUrlModel, AuthUrlTarget } from '../interfaces/models/authUrl';

const userMetaDataSchema: Schema = new Schema(
    {
        appUserId: { type: String, required: true },
        username: { type: String },
        firstName: { type: String },
        lastName: { type: String }
    },
    {
        _id: false
    }
);

const authUrlSchema: Schema = new Schema(
    {
        target: { type: String, enum: Object.values(AuthUrlTarget), required: true },
        key: { type: String, unique: true, required: true },
        userMetaData: { type: userMetaDataSchema },
        userId: { type: ObjectId },
        used: { type: Date }
    },
    {
        timestamps: true
    }
);

export default model<AuthUrlModel>('AuthUrl', authUrlSchema);
