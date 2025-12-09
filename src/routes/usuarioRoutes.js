<<<<<<< HEAD
import express from "express";
const router = express.Router();

// rota de teste temporária
router.get("/", (req, res) => {
  res.json({ message: "Rota de usuários funcionando! ✅" });
=======
import { Router } from 'express';
const router = Router();

// exemplo de rota
router.get('/', (req, res) => {
  res.send('Rota de usuários funcionando!');
>>>>>>> main
});

export default router;
