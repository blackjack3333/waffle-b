import { model, Schema } from 'mongoose';
import { ObjectId } from 'bson';

import { SpaceModel } from '../interfaces/models/space';

const spaceSchema: Schema = new Schema(
    {
        userId: { type: ObjectId, index: true, required: true },
        userBotId: { type: ObjectId, index: true, required: true },
        hashId: { type: String, unique: true, required: true }
    },
    {
        timestamps: true
    }
);

spaceSchema.index({ userId: 1, userBotId: 1 }, { unique: true });

export default model<SpaceModel>('Space', spaceSchema);
