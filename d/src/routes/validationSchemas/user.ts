import { AuthUrlSource } from '../../interfaces/services/authUrl';

export const addOrUpdateProfileSchema: any = {
    query: {
        source: { type: 'string', enum: Object.values(AuthUrlSource), optional: true },
        uid: { type: 'string', optional: true }
    }
};
