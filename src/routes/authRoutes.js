import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// Rotas públicas
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Rota protegida
router.get('/me', authenticate, AuthController.me);

export default router;
