import express from 'express';
import { agendamentoController } from '../controllers/agendamentoController.js';
import { verificarTipo } from '../middlewares/verificarTipo.js';
import { Router } from 'express';

const router = express.Router();




// Rota de Teste Simples
router.get("/teste-simples", (req, res) => {
    res.json({ mensagem: "A rota AGENDAMENTOS/TESTE-SIMPLES está funcionando!" });
});



// Quando a dupla 2 terminar a autenticação
// import { authMiddleware } from '../middlewares/authMiddleware.js';


// Apenas clientes podem criar agendamentos
router.post('/', verificarTipo("CLIENTE"), agendamentoController.create);

// clientes e barbeiros podem ver seus agendamentos
router.get('/', verificarTipo("CLIENTE", "BARBEIRO"), agendamentoController.findAll);

// clientes e barbeiros podem ver agendamentos por ID se forem seus próprios
router.get('/:id', verificarTipo("CLIENTE", "BARBEIRO"), agendamentoController.findById);

// Clientes e barbeiros podem atualizar seus próprios agendamentos
router.put('/:id', verificarTipo("CLIENTE", "BARBEIRO"), agendamentoController.update);

// Apenas clientes podem deletar seus próprios agendamentos
router.delete('/:id', verificarTipo("CLIENTE"), agendamentoController.delete);


export default router;