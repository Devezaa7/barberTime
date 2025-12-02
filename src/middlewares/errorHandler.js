const errorHandler = (err, req, res, next) => {
  console.error('erro:', err);

  // erro do prisma
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      error: 'erro no banco',
      message: err.message,
    });
  }

  const status = err.statusCode || 500;
  const msg = err.message || 'erro interno';

  res.status(status).json({ error: msg });
};

export default errorHandler;