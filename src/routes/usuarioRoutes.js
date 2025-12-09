import express from "express";
const router = express.Router();

// rota de teste temporária
router.get("/", (req, res) => {
  res.json({ message: "Rota de usuários funcionando!" });
});

export default router;
