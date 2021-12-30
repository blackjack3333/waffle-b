import { Router } from 'express';

import checkJwtMiddleware from './middlewares/checkJwt';

import spaceController from '../controllers/space';
import transcriptionController from '../controllers/transcription';

const spaceV1Router: Router = Router();

spaceV1Router.get('/', checkJwtMiddleware, spaceController.getList);
spaceV1Router.get('/:spaceHashId/transcriptions', checkJwtMiddleware, transcriptionController.getListBySpaceHashId);
spaceV1Router.get('/:spaceHashId/transcriptions/:transcriptionHashId', checkJwtMiddleware, transcriptionController.getTranscriptionDetails);

export { spaceV1Router };
