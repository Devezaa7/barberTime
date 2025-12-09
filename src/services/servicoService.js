import ServicoRepository from "../repositories/servicoRepository.js";

const ServicoService = {
  criar: async (dados) => {
    return ServicoRepository.criar(dados);
  },

  listar: async (page = 1, perPage = 10) => {
    const skip = (page - 1) * perPage;
    
    const servicos = await ServicoRepository.listar(skip, perPage);
    const total = await ServicoRepository.contar();

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      data: servicos
    };
  },

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

  deletar: async (id) => {
    await this.buscarPorId(id);
    return ServicoRepository.deletar(id);
  }
};

export default ServicoService;