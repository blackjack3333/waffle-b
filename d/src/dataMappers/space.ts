import { UserBotNamesMap } from '../interfaces/services/userBot';
import { UserSpaces } from '../interfaces/dataMappers/space';
import { SpaceModel } from '../interfaces/models/space';

class SpaceDataMapper {
    toSpacesEntity(spaces: SpaceModel[], userBotNamesMap: UserBotNamesMap): UserSpaces {
        return spaces.map(({ userBotId, hashId }: SpaceModel) => ({
            id: hashId,
            name: userBotNamesMap.get(userBotId.toHexString())
        }));
    }
}

export default new SpaceDataMapper();
