import { UserBotType } from '../models/userBot';
import { FileLang } from '../models/file';

export interface UploadAudioBodyRequest {
    botType: UserBotType;
    appUserId: string;
    link: string;
    lang: FileLang;
}
