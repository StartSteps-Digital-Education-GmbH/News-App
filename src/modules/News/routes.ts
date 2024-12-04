import { Router } from 'express';
import newsValidationSchemas from './validation.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import newsController from './controller.js';
const router = Router();

router.get(
  '/latest',
  validateRequest(newsValidationSchemas.latestNews),
  newsController.getLatestNews,
);

router.get(
  '/sources',
  validateRequest(newsValidationSchemas.getSources), 
  newsController.getSources, 
);

export default router;
