import { AuthUrlTarget } from '../../interfaces/models/authUrl';

export const getAuthUrlByTargetSchema: any = {
    params: {
        target: { type: 'string', enum: Object.values(AuthUrlTarget) }
    },
    query: {
        appUserId: { type: 'string' },
        username: { type: 'string', optional: true },
        firstName: { type: 'string', optional: true },
        lastName: { type: 'string', optional: true }
    }
};
