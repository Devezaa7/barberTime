import { Router } from 'express';
const router = Router();

// exemplo de rota
router.get('/', (req, res) => {
  res.send('Rota de usuários funcionando!');
});

export default router;
