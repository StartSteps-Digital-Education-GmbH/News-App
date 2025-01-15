import { Router } from 'express';
import healthController from './healthController.js';

const router = Router();

router.get('/health', healthController.health);

export default router;
