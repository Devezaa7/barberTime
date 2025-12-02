import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes.js';
import servicoRoutes from './servicoRoutes.js';
import agendamentoRoutes from './agendamentoRoutes.js';

const router = Router();

router.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/usuarios', usuarioRoutes);
router.use('/servicos', servicoRoutes);
router.use('/agendamentos', agendamentoRoutes);

export default router;