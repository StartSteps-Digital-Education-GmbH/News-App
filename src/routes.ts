import userRoutes from './modules/User/routes.js';
import Router from 'express';

const router = Router();

router.use('/user', userRoutes);

export default router;

