/**
 * Middleware de tratamento centralizado de erros
 * Captura todos os erros da aplicação e retorna respostas padronizadas
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro capturado:', err);

  // Erro de validação do Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.errors.map(e => ({
        campo: e.path.join('.'),
        mensagem: e.message
      }))
    });
  }

  // Erro do Prisma - registro não encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado',
      message: 'O recurso solicitado não existe no banco de dados'
    });
  }

  // Erro do Prisma - violação de constraint único
  if (err.code === 'P2002') {
    const campo = err.meta?.target?.[0] || 'campo';
    return res.status(409).json({
      error: 'Conflito',
      message: `Já existe um registro com este ${campo}`
    });
  }

  // Erro do Prisma - violação de foreign key
  if (err.code === 'P2003') {
    return res.status(400).json({
      error: 'Referência inválida',
      message: 'Um dos IDs fornecidos não existe'
    });
  }

  // Erro de autenticação (JWT)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'Token de autenticação inválido ou expirado'
    });
  }

  // Erro de autorização customizado
  if (err.name === 'UnauthorizedError') {
    return res.status(403).json({
      error: 'Não autorizado',
      message: err.message || 'Você não tem permissão para acessar este recurso'
    });
  }

  // Erro genérico com statusCode customizado
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  return res.status(statusCode).json({
    error: statusCode === 500 ? 'Erro interno' : 'Erro',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;