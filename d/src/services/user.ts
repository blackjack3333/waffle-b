import auth0Service from './auth0';

import userModel from '../models/user';

import { Auth0UserProfile } from '../interfaces/services/auth0';
import { UserModel } from '../interfaces/models/user';

class UserService {
    async addOrUpdateUserByAccessToken(accessToken: string): Promise<UserModel> {
        const profile: Auth0UserProfile = await auth0Service.getProfile(accessToken);
        if (!profile) {
            throw new Error('Failed to get user profile by access token');
        }

        const { sub, given_name: givenName, family_name: familyName, nickname, picture, email } = profile;

        let user: UserModel = await userModel.findOne({ email });
        if (user) {
            if (!user.externalUserIds.includes(sub)) {
                user.externalUserIds.push(sub);

                await user.save();
            }
        } else {
            user = await userModel.create({
                email,
                firstName: givenName?.trim(),
                lastName: familyName?.trim(),
                nickName: nickname,
                picture,
                externalUserIds: [sub]
            });
        }

        return user;
    }
}

export default new UserService();
