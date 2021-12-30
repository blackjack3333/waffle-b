import { auth } from 'express-oauth2-jwt-bearer';

import configService from '../../services/config';

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
export default auth({
    audience: configService.get('auth0.audience'),
    issuerBaseURL: configService.get('auth0.issuerBaseUrl')
});