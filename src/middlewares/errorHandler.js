export default function errorHandler(err, req, res, next) {
  console.log("Erro capturado: ", err);

  // erros de validação Zod
  if(err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Erro de validação dos dados enviados",
      errors: err.errors.map(e => ({
        campo: e.path.join("."),
        messagem: e.message,
      })),
    });
  }

  //erros do Prisma(unique violation, referência inexistente...)
  if(err.code && typeof err.code === 'string' && err.code.startsWith("P")) {
    return res.status(400).json({
      success: false,
      message: "Erro ao acessar o banco de dados",
      error: err.message,
    });
  }

  //erros de regra de negócio
  if(err.statusCode === undefined && err.message) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  //erros gerais
  const status = err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Erro interno do servidor",
  });
}