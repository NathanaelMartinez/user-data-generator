import { Router } from 'express';
import { generateUsers } from '../controllers/UserController.js';

const router = Router();

router.get('/users/:localeId/:seed/:errorSize', generateUsers);

export default router;
