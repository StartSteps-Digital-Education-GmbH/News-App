import { Router } from 'express';
import newsValidationSchemas from './validation.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import newsController from './controller.js';
import authMiddleWare from '../../middleware/auth.js';
const router = Router();

router.get(
  '/latest',
  validateRequest(newsValidationSchemas.latestNews),
  newsController.getLatestNews,
);

router.get(
  '/headlines',
  authMiddleWare,
  validateRequest(newsValidationSchemas.headlines),
  newsController.getTopHeadlines,
);

export default router;
