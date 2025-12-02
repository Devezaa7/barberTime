import { PrismaClient } from '@prisma/client';

// Cria instância do Prisma com middleware de soft delete
const prisma = new PrismaClient();

// Middleware que adiciona soft delete automático
prisma.$use(async (params, next) => {
  // Intercepta operações de DELETE e transforma em UPDATE
  if (params.action === 'delete') {
    params.action = 'update';
    params.args['data'] = { deletedAt: new Date() };
  }

  if (params.action === 'deleteMany') {
    params.action = 'updateMany';
    if (params.args.data != undefined) {
      params.args.data['deletedAt'] = new Date();
    } else {
      params.args['data'] = { deletedAt: new Date() };
    }
  }

  // Filtra registros deletados automaticamente em leituras
  if (params.action === 'findUnique' || params.action === 'findFirst') {
    params.action = 'findFirst';
    params.args.where['deletedAt'] = null;
  }

  if (params.action === 'findMany') {
    if (params.args.where) {
      if (params.args.where.deletedAt == undefined) {
        params.args.where['deletedAt'] = null;
      }
    } else {
      params.args['where'] = { deletedAt: null };
    }
  }

  // Continua a execução
  return next(params);
});

export default prisma;