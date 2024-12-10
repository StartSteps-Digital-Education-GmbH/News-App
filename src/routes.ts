import Router from 'express';

import userRoutes from './modules/User/routes.js';
import newsRoutes from './modules/News/routes.js';
import bookmarkRouter from './modules/Bookmark/routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/news', newsRoutes);
router.use('/bookmark', bookmarkRouter);

export default router;
