import { Router } from 'express';
import { validator } from 'express-fastest-validator';

import fileController from '../controllers/file';

import { uploadAudioSchema } from './validationSchemas/file';

const fileV1Router: Router = Router();

fileV1Router.post('/audio', validator(uploadAudioSchema), fileController.uploadAudio);

export { fileV1Router };
