import prisma from "../config/prisma.js";

const ServicoService = {
  criar: async (dados) => {
    return prisma.servico.create({ data: dados });
  },

  listar: async (page = 1, perPage = 10) => {
    const skip = (page - 1) * perPage;

    const servicos = await prisma.servico.findMany({
      skip,
      take: perPage,
      where: { deletedAt: null }
    });

    const total = await prisma.servico.count();

    return {
      page,
      perPage,
      total,
      data: servicos
    };
  },

  buscarPorId: async (id) => {
    return prisma.servico.findUnique({ where: { id } });
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

export default ServicoService;