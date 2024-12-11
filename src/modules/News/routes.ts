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
  '/personalized',
  authMiddleWare,
  validateRequest(newsValidationSchemas.personalizedNews),
  newsController.getPersonalizedNews,
);

router.get(
  '/headlines',
  authMiddleWare,
  validateRequest(newsValidationSchemas.headlines),
  newsController.getTopHeadlines,
);

router.get(
  '/single',
  validateRequest(newsValidationSchemas.fetchSingleArticle),
  newsController.fetchSingleArticle,
);

export default router;
