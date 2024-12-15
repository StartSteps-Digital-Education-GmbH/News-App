import { Router } from 'express';
import authMiddleware from '../../middleware/auth.js';
import commentsController from '../Comment/controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import commentsValidationSchema from './validation.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validateRequest(commentsValidationSchema.comments),
  commentsController.commentOnNewsArticle,
);
router.get(
  '/:newsId',
  validateRequest(commentsValidationSchema.comments),
  commentsController.getNewsComments,
);
export default router;
