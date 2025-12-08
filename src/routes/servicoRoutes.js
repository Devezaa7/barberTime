import { Router } from "express";
import ServicoController from "src/controllers/servicoController.js";

const router = Router();

// Listar todos
router.get("/servicos", ServicoController.listar);

// Buscar por ID
router.get("/servicos/:id", ServicoController.buscarPorId);

// Criar serviço
router.post("/servicos", ServicoController.criar);

// Atualizar serviço
router.put("/servicos/:id", ServicoController.atualizar);

// Deletar serviço
router.delete("/servicos/:id", ServicoController.deletar);

export default router;