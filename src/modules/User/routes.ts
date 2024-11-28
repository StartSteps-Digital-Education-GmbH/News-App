import { Router } from 'express';

import userController from './controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import userValidationSchema from './validation.js';
import auth from '../../middleware/auth.js';
const router = Router();

router.post(
  '/register',
  validateRequest(userValidationSchema.register),
  userController.register,
);
router.post(
  '/login',
  validateRequest(userValidationSchema.login),
  userController.login,
);
router.get('/profile', auth, userController.profile);
export default router;
