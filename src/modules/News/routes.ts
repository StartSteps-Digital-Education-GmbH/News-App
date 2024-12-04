import { Router } from 'express';
import newsValidationSchemas from './validation.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import newsController from './controller.js';
const router = Router();
import auth from '../../middleware/auth.js';

router.get(
  '/latest',
  validateRequest(newsValidationSchemas.latestNews),
  newsController.getLatestNews,
);
router.get('/personalized', auth, newsController.getPersonalizedNews);

export default router;
