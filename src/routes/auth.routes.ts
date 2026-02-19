import {Router} from 'express';
import { register, login } from '../controllers/auth.controllers';

const router = Router();

//when someone sends a POST request to /register , run the register controller 
router.post('/register', register);

//when someone sends a POST request to /login , run the login controller 
router.post('/login', login);

export default router;