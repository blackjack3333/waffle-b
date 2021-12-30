import { Router } from 'express';
import { validator } from 'express-fastest-validator';

import checkJwtMiddleware from './middlewares/checkJwt';

import userController from '../controllers/user';

import { addOrUpdateProfileSchema } from './validationSchemas/user';

const userV1Router: Router = Router();

// TODO: this is a techical endpoint just to store user and trigger telegram bot if needed
// rename endpoint
userV1Router.get('/profile', checkJwtMiddleware, validator(addOrUpdateProfileSchema), userController.addOrUpdateProfile);

export { userV1Router };
