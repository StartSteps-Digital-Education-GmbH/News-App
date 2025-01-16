import { Router } from 'express';
import authMiddleware from '../../middleware/auth.js';
import commentsController from '../Comment/controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import commentsValidationSchema from './validation.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validateRequest(commentsValidationSchema.createComments),
  commentsController.commentOnNewsArticle,
);
router.post(
  '/getcommentbyurl',
  validateRequest(commentsValidationSchema.getComments),
  commentsController.getNewsComments,
);
export default router;
