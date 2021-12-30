import { FileLang } from '../../interfaces/models/file';
import { UserBotType } from '../../interfaces/models/userBot';

export const uploadAudioSchema: any = {
    body: {
        botType: { type: 'string', enum: Object.values(UserBotType) },
        appUserId: { type: 'string' },
        link: { type: 'string' },
        lang: { type: 'string', enum: Object.values(FileLang) }
    }
};
