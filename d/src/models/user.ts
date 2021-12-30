import { model, Schema } from 'mongoose';

import { UserModel } from '../interfaces/models/user';

const userSchema: Schema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        firstName: { type: String },
        lastName: { type: String },
        nickName: { type: String },
        picture: { type: String, required: true },
        externalUserIds: { type: [String], index: true, required: true }
    },
    {
        timestamps: true
    }
);

export default model<UserModel>('User', userSchema);
