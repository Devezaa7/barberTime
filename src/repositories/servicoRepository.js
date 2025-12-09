import prisma from "../config/database.js";

const ServicoRepository = {
  criar: async (dados) => {
    return prisma.servico.create({ data: dados });
  },

  listar: async (skip, take) => {
    return prisma.servico.findMany({
      skip,
      take,
      where: { deletedAt: null },
      include: {
        barbeiro: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  contar: async () => {
    return prisma.servico.count({
      where: { deletedAt: null }
    });
  },

  buscarPorId: async (id) => {
    return prisma.servico.findUnique({ 
      where: { id },
      include: {
        barbeiro: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
  },

  atualizar: async (id, dados) => {
    return prisma.servico.update({
      where: { id },
      data: dados
    });
  },

  deletar: async (id) => {
    return prisma.servico.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
};

export default ServicoRepository;