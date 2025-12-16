import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 BarberTime API rodando na porta ${PORT}`);
  console.log(`📘 Swagger disponível em http://localhost:${PORT}/api-docs`);
});
