import prisma from "../prisma/client.js";
import ServicoRepository from "../repositories/servicoRepository.js";

export const ServicoService = {
  // Criar um novo serviço
  criar: async (dados) => {
    console.log("Dados recebidos no service:", dados); // Log pra confirmar que o barbeiroId chegou

    if (!dados.barbeiroId) {
      throw new Error("O campo 'barbeiroId' é obrigatório e deve ser um UUID válido.");
    }

    return prisma.servico.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao || null,
        preco: Number(dados.preco),
        duracao: Number(dados.duracao),
        barbeiroId: dados.barbeiroId, // vínculo com o barbeiro
      },
    });
    return ServicoRepository.criar(dados);
  },

  // Listar serviços com paginação
  listar: async (page = 1, perPage = 10) => {
    const skip = (page - 1) * perPage;

    const servicos = await prisma.servico.findMany({
      skip,
      take: perPage,
      where: { deletedAt: null },
    });

    const total = await prisma.servico.count({
      where: { deletedAt: null },
    });

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      data: servicos
    };
  },

  // Buscar serviço por ID
  buscarPorId: async (id) => {
    const servico = await ServicoRepository.buscarPorId(id);
    
    if (!servico) {
      throw new Error("Serviço não encontrado");
    }
    
    return servico;
  },

  atualizar: async (id, dados) => {
    await this.buscarPorId(id);
    return ServicoRepository.atualizar(id, dados);
  },

  // Atualizar serviço
  atualizar: async (id, dados) => {
  // remove campos undefined
  const dadosLimpos = Object.fromEntries(
    Object.entries(dados).filter(([_, v]) => v !== undefined)
  );

  console.log("Dados limpos enviados para update:", dadosLimpos);

  return prisma.servico.update({
    where: { id },
    data: {
      ...dadosLimpos,
      updatedAt: new Date(),
    },
  });
},


  // Soft delete de serviço
  deletar: async (id) => {
    return prisma.servico.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
