import { Router } from "express";
<<<<<<< HEAD
import ServicoController from "../controllers/servicoController.js";
=======
import ServicoController from "../controllers/servicoController.js";  
>>>>>>> main

const router = Router();

// Listar todos
<<<<<<< HEAD
router.get("/", ServicoController.listar);
=======
router.get("/", ServicoController.listar);  
>>>>>>> main

// Buscar por ID
router.get("/:id", ServicoController.buscarPorId);

// Criar serviço
router.post("/", ServicoController.criar);

// Atualizar serviço
router.put("/:id", ServicoController.atualizar);

// Deletar serviço
router.delete("/:id", ServicoController.deletar);

export default router;
