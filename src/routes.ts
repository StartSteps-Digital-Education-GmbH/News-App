import Router from 'express';

import userRoutes from './modules/User/routes.js';
import newsRoutes from './modules/News/routes.js';
import bookmarkRouter from './modules/Bookmark/routes.js';
import commentsRoutes from './modules/Comment/routes.js';
import healthRouter from './healthController.js';

const router = Router();

router.use('/health', healthRouter.health);
router.use('/users', userRoutes);
router.use('/news', newsRoutes);
router.use('/bookmarks', bookmarkRouter);
router.use('/comments', commentsRoutes);

export default router;
