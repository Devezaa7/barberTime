import prisma from "../config/database.js";

const AgendamentoRepository = {
  // TODO: Dupla 3 (Pessoa 6) - Implementar CRUD completo
  
  criar: async (dados) => {
    return prisma.agendamento.create({ 
      data: dados,
      include: {
        cliente: {
          select: { id: true, nome: true, email: true, telefone: true }
        },
        barbeiro: {
          select: { id: true, nome: true }
        },
        servico: {
          select: { id: true, nome: true, preco: true, duracao: true }
        }
      }
    });
  },

  listar: async (skip, take, filtros = {}) => {
    return prisma.agendamento.findMany({
      skip,
      take,
      where: {
        deletedAt: null,
        ...filtros
      },
      include: {
        cliente: {
          select: { id: true, nome: true, email: true, telefone: true }
        },
        barbeiro: {
          select: { id: true, nome: true }
        },
        servico: {
          select: { id: true, nome: true, preco: true, duracao: true }
        }
      },
      orderBy: {
        dataHora: 'asc'
      }
    });
  },

  buscarPorId: async (id) => {
    return prisma.agendamento.findUnique({ 
      where: { id },
      include: {
        cliente: {
          select: { id: true, nome: true, email: true, telefone: true }
        },
        barbeiro: {
          select: { id: true, nome: true }
        },
        servico: {
          select: { id: true, nome: true, preco: true, duracao: true }
        }
      }
    });
  },

  verificarConflito: async (barbeiroId, dataHora, duracaoMinutos, agendamentoId = null) => {
    const dataFim = new Date(dataHora);
    dataFim.setMinutes(dataFim.getMinutes() + duracaoMinutos);

    const where = {
      barbeiroId,
      deletedAt: null,
      status: { in: ['PENDENTE', 'CONFIRMADO'] },
      dataHora: {
        gte: dataHora,
        lt: dataFim
      }
    };

    if (agendamentoId) {
      where.id = { not: agendamentoId };
    }

    return prisma.agendamento.findFirst({ where });
  },

  atualizar: async (id, dados) => {
    return prisma.agendamento.update({
      where: { id },
      data: dados,
      include: {
        cliente: {
          select: { id: true, nome: true, email: true }
        },
        barbeiro: {
          select: { id: true, nome: true }
        },
        servico: {
          select: { id: true, nome: true, preco: true, duracao: true }
        }
      }
    });
  },

  deletar: async (id) => {
    return prisma.agendamento.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  },

  contar: async (filtros = {}) => {
    return prisma.agendamento.count({
      where: {
        deletedAt: null,
        ...filtros
      }
    });
  }
};

export default AgendamentoRepository;