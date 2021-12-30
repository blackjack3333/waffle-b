import { Router } from 'express';

import { authV1Router } from './auth';
import { userV1Router } from './user';
import { fileV1Router } from './file';
import { spaceV1Router } from './space';

const apiV1Router: Router = Router();

apiV1Router.use('/auth', authV1Router);
apiV1Router.use('/users', userV1Router);
apiV1Router.use('/files', fileV1Router);
apiV1Router.use('/spaces', spaceV1Router);

export { apiV1Router };