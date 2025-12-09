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
            //id para teste, depois trocar por req.user.id que vem do Jwt
            const clienteId =  "2d92b846-f761-4518-b41f-6f978acefe66" //|| "15883368-aa78-40de-b22e-e66c32959f47"

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
            const user = req.user || { id: "15883368-aa78-40de-b22e-e66c32959f47", tipo: "BARBEIRO" }; // depende da dupla 2
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
            const user = req.user || { id: "15883368-aa78-40de-b22e-e66c32959f47", tipo: "BARBEIRO" }; // depende da dupla 2
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
            const user = req.user || { id: "2d92b846-f761-4518-b41f-6f978acefe66", tipo: "CLIENTE" }; // depende da dupla 2
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
            const user = req.user || { id: "2d92b846-f761-4518-b41f-6f978acefe66", tipo: "CLIENTE" }; // depende da dupla 2
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