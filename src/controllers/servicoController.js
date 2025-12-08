import ServicoService from "../services/servicoService.js";
import criarServicoValidation from "../validations/servicoValidation.js";

const ServicoController = {
  criar: async (req, res) => {
    try {
      const dados = criarServicoValidation.parse(req.body);
      const novoServico = await ServicoService.criar(dados);
      return res.status(201).json(novoServico);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const { page = 1, perPage = 10 } = req.query;
      const resultado = await ServicoService.listar(Number(page), Number(perPage));
      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const servico = await ServicoService.buscarPorId(id);

      if (!servico) {
        return res.status(404).json({ error: "Serviço não encontrado" });
      }

      return res.status(200).json(servico);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const dados = criarServicoValidation.parse(req.body);
      const servicoAtualizado = await ServicoService.atualizar(id, dados);  // ✅ CORRIGIDO: id é string

      return res.status(200).json(servicoAtualizado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      await ServicoService.deletar(id); 

      return res.status(200).json({ message: "Serviço deletado com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

export default ServicoController;