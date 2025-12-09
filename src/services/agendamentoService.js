import { success } from 'zod';
import prisma from '../prisma/client.js';
import { ServicoService } from './servicoService.js'
// exportando as funções do serviço de agendamento
export const agendamentoService = {
    // agendamentoService.js - Função create
async create(data, clienteId) {
    
    const servico = await ServicoService.buscarPorId(data.servicoId);
    
    //Verificação de existência de serviço
    if (!servico || servico.deletedAt) {
        throw new Error('Serviço não encontrado ou indisponível.');
    }

    //  Verifica se barbeiro informado é o mesmo que oferece o serviço
    if (servico.barbeiroId !== data.barbeiroId) {
        throw new Error('O barbeiro informado não oferece esse serviço.');
    }
    
    // de conflito de agendamento 
    const inicio = new Date(data.dataHora);
    // REMOVA A LINHA REDUNDANTE: const servicoDuracao = await ServicoService.buscarPorId(data.servicoId);
    const fim = new Date(inicio.getTime() + servico.duracao * 60000); // Usa 'servico.duracao'
    
        if (conflito) {
            throw new Error('Já existe um agendamento para este barbeiro neste horário ou há conflito de duração com outro agendamento feito com esse barbeiro');
        }


        // criando o agendamento
        return prisma.agendamento.create({
            data: {
                dataHora: new Date(data.dataHora),
                observacao: data.observacao || null,
                clienteId, //associando o cliente
                barbeiroId: data.barbeiroId,
                servicoId: data.servicoId,
            },
            include: { servico: true, barbeiro: true},
        });
    },

// buscando todos os agendamentos

    async findAll(user, page = 1, perPage = 10) {
        const filtros = 
            user.tipo === "BARBEIRO"
            ? { barbeiroId: user.id}
            : { clienteId: user.id};

        const skip = (page - 1) * perPage

        const [agendamentos, total] = await Promise.all([
            prisma.agendamento.findMany({
                where: { ...filtros, deletedAt: null },
                include: { servico: true, barbeiro: true, cliente: true },
                orderBy: { dataHora: "asc" },
                skip,
                take: perPage,
                }),
        prisma.agendamento.count({ where: { ...filtros, deletedAt: null } }),
  ]);
        return {
            success: true,
            message: "Lista de agendamentos retornada com sucesso",
            pagination: {
                page,
                perPage,
                total,

            },
            
            data: agendamentos,
        };    
        
    },
// buscando agendamento por ID
    async findById(id, user) {
        const agendamento = await prisma.agendamento.findUnique({
            where: { id },
            include: { servico: true, barbeiro: true, cliente: true},

        });

        console.log("Usuário logado:", user);
        console.log("Agendamento:", agendamento);

        
                
//se não encontrar ou estiver deletado
        if(!agendamento || agendamento.deletedAt) {
            throw new Error("Agendamento não encontrado");
        }

        //restrição de acesso: cliente ou barbeiro só vê seus próprios agendamentos
        // Restrição de acesso 
const tipo = user.tipo?.toUpperCase(); // garante que "barbeiro" ou "BARBEIRO" funcionem igual

if (tipo === "CLIENTE" && agendamento.clienteId !== user.id) {
    throw new Error("Acesso negado");
}

if (tipo === "BARBEIRO" && agendamento.barbeiroId !== user.id) {
    throw new Error("Acesso negado");
}

return agendamento;

},
// atualizando agendamento
    async update (id, data, user) {
        const agendamento = await prisma.agendamento.findUnique({ where: { id } });

       
        if(!agendamento) throw new Error("Agendamento não encontrado");
// verifica se o usuario é dono do agendamento

        const tipo = user.tipo?.toUpperCase();

        if (tipo === "CLIENTE" && agendamento.clienteId !== user.id) {
            throw new Error("Acesso negado");
        }
        if (tipo === "BARBEIRO" && agendamento.barbeiroId !== user.id) {
    throw new Error("Acesso negado");
  }
  // atualizando os campos permitidos
        return prisma.agendamento.update({
            where: { id },
            data: {
                dataHora: data.dataHora ? new Date (data.dataHora) : agendamento.dataHora,
                status: data.status || agendamento.status,
                observacao: data.observacao ?? agendamento.observacao,

            },
        });
            
    },
// deletando agendamento
    async delete (id, user) {
        const agendamento = await prisma.agendamento.findUnique({ where: { id } });
        if (!agendamento) throw new Error ("Agendamento não encontrado");
//verifica se o usuario é dono do agendamento

        const tipo = user.tipo?.toUpperCase();
        if (tipo === "CLIENTE" && agendamento.clienteId !==user.id){
            throw new Error ("Acesso negado");
        }   
        if (tipo === "BARBEIRO" && agendamento.barbeiroId !== user.id) {
            throw new Error("Acesso negado");
        }

        //soft delete
        return prisma.agendamento.update({
            where: { id },
            data: { deletedAt: new Date() }, 
        });
    },

};