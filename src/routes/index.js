import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes.js';
import servicoRoutes from './servicoRoutes.js';
import agendamentoRoutes from './agendamentoRoutes.js';
import authRoutes from './authRoutes.js'; // ← ADICIONADO AQUI

const router = Router();

router.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

// Rotas de autenticação
router.use('/auth', authRoutes); // ← ADICIONADO AQUI

// Rotas de recursos
router.use('/usuarios', usuarioRoutes);
router.use('/servicos', servicoRoutes);
router.use('/agendamentos', agendamentoRoutes);

export default router; 