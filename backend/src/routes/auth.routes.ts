import { Router } from 'express';
import { register, login } from '../controllers/auth.controllers';
import { validate } from '../middlewares/validate.middleware';
import { AuthSchema } from '../services/auth.service';

const router = Router();

router.post('/register', validate(AuthSchema), register);
router.post('/login', validate(AuthSchema), login);

export default router;
