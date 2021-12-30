import { ObjectId } from 'bson';

import userBotService from './userBot';

import spaceDataMapper from '../dataMappers/space';

import spaceModel from '../models/space';

import Utils from '../utils';

import { UserSpaces } from '../interfaces/dataMappers/space';
import { SpaceModel } from '../interfaces/models/space';
import { UserBotNamesMap } from '../interfaces/services/userBot';
import { ModelNotFoundError } from '../errors/ModelNotFoundError';

class SpaceService {
    async create(userId: ObjectId, userBotId: ObjectId): Promise<void> {
        console.log('Start create user space', { userId, userBotId });

        await spaceModel.create({ userId, userBotId, hashId: Utils.createRandomBytes() });
    }

    async getUserSpaces(userId: ObjectId): Promise<UserSpaces> {
        const spaces: SpaceModel[] = await spaceModel.find({ userId });
        if (!spaces.length) {
            return [];
        }

        const userBotNamesMap: UserBotNamesMap = await userBotService.getUserBotNamesByUserId(userId);
        if (!userBotNamesMap.size) {
            return [];
        }

        return spaceDataMapper.toSpacesEntity(spaces, userBotNamesMap);
    }

    async getByHashIdAndUserId(hashId: string, userId: ObjectId): Promise<SpaceModel> {
        const space: SpaceModel = await spaceModel.findOne({ hashId, userId });
        if (!space) {
            throw new ModelNotFoundError(spaceModel.modelName, hashId);
        }

        return space;
    }

    async getSpaceByUserIdAndUserBotId(userId: ObjectId, userBotId: ObjectId): Promise<SpaceModel> {
        const space: SpaceModel = await spaceModel.findOne({ userId, userBotId });
        if (!space) {
            throw new ModelNotFoundError(spaceModel.modelName, userBotId.toHexString());
        }

        return space;
    }
}

export default new SpaceService();
