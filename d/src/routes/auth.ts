import { Router } from 'express';
import { validator } from 'express-fastest-validator';

import authController from '../controllers/auth';

import { getAuthUrlByTargetSchema } from './validationSchemas/auth';

const authV1Router: Router = Router();

authV1Router.get('/url/:target', validator(getAuthUrlByTargetSchema), authController.getAuthUrlByTarget);

export { authV1Router };