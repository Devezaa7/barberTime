import { success } from "zod";
import { agendamentoService } from "../services/agendamentoService.js";
import { agendamentoSchema } from "../validations/agendamentoValidation.js";


// exportando as funções do controlador de agendamento
export const agendamentoController = {
    async create(req, res) {
        try {

            
            //validando dados com zod
            const data = agendamentoSchema.parse(req.body);

            //dependo da autenticação Jwt
            //id para teste passado no body, depois trocar pelo que vem do Jwt
            const clienteId =  req.user.id;

            const novoAgendamento = await agendamentoService.create(data, clienteId);
            res.status(201).json({
                success: true,
                message: "Agendamento criado com sucesso",
                data: novoAgendamento,
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async findAll(req, res) {
        try {
            const user = req.user; // depois mudar pra o original do jwt
            const { page = 1, perPage = 10 } = req.query;

            const lista = await agendamentoService.findAll(user, Number(page), Number(perPage));
            return res.json(lista);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async findById(req, res) {
        console.log("entrou no controller findById");
        try {
            const user = req.user; // depois mudar pra o original do jwt
            const agendamento = await agendamentoService.findById(req.params.id, user);
            res.status(200).json({
                success: true,
                data: agendamento,
            });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async update(req, res) {
        try {
            const user = req.user; // mudar pra o original do jwt
            const atualizado = await agendamentoService.update(req.params.id, req.body, user);
            res.status(200).json({
                success: true,
                message: "Agendamento atualizado com sucesso",
                data: atualizado,
            }); 
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async delete(req, res) {
        try {
            const user = req.user; // mudar pro original jwt
            await agendamentoService.delete(req.params.id, user);
            res.status(200).json({
                success: true,
                message: "Agendamento excluído com sucesso",
             });


        } catch (e) {
            res.status(400).json({ error: e.message });
        
        }
    },

};