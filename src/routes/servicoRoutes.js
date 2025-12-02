import { Router } from 'express';

const router = Router();

// TODO: fazer depois
router.get('/', (req, res) => {
  res.json({ msg: 'servicos - a fazer' });
});

export default router;