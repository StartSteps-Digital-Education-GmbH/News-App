import Router from 'express';

import userRoutes from './modules/User/routes.js';
import newsRoutes from './modules/News/routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/news', newsRoutes);

export default router;
