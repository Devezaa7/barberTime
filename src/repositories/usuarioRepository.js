import prisma from "../config/database.js";

const UsuarioRepository = {
  // TODO: Dupla 2 - Implementar após criar autenticação
  
  criar: async (dados) => {
    return prisma.usuario.create({ data: dados });
  },

  buscarPorEmail: async (email) => {
    return prisma.usuario.findUnique({ 
      where: { email }
    });
  },

  buscarPorId: async (id) => {
    return prisma.usuario.findUnique({ 
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo: true,
        createdAt: true,
        updatedAt: true
        // senha NÃO deve ser retornada
      }
    });
  },

  listar: async (skip, take) => {
    return prisma.usuario.findMany({
      skip,
      take,
      where: { deletedAt: null },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        tipo: true,
        createdAt: true
      },
      orderBy: {
        nome: 'asc'
      }
    });
  },

  contar: async () => {
    return prisma.usuario.count({
      where: { deletedAt: null }
    });
  },

  atualizar: async (id, dados) => {
    return prisma.usuario.update({
      where: { id },
      data: dados
    });
  },

  deletar: async (id) => {
    return prisma.usuario.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
};

export default UsuarioRepository;