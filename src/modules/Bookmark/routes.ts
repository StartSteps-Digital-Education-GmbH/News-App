import { Router } from 'express';
import bookmarkController from './controller.js';
import auth from '../../middleware/auth.js';
import validationSchema from './validation.js';
import { validateRequest } from '../../middleware/validateRequest.js';

const router = Router();

router.post(
  '/',
  auth,
  validateRequest(validationSchema.create),
  bookmarkController.createBookmark,
);

router.get(
  '/:bookmarkId',
  auth,
  validateRequest(validationSchema.getBookmarkedArticle),
  bookmarkController.getBookmarkedArticle,
);

export default router;
