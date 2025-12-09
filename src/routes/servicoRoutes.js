import { Router } from "express";
import ServicoController from "../controllers/servicoController.js";

const router = Router();

// Listar todos
router.get("/", ServicoController.listar);

// Buscar por ID
router.get("/:id", ServicoController.buscarPorId);

// Criar serviço
router.post("/", ServicoController.criar);

// Atualizar serviço
router.put("/:id", ServicoController.atualizar);

// Deletar serviço
router.delete("/:id", ServicoController.deletar);

export default router;
