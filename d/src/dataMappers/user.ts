import { UserProfile } from '../interfaces/dataMappers/user';
import { UserModel } from '../interfaces/models/user';

class UserDataMapper {
    toProfileEntity(user: UserModel): UserProfile {
        const { firstName, lastName, nickName, picture: logo } = user;

        return {
            firstName,
            lastName,
            nickName,
            logo
        };
    }
}

export default new UserDataMapper();
