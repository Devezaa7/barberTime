import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import routes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

/* MIDDLEWARES GLOBAIS */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROTA RAIZ */
app.get('/', (req, res) => {
  res.json({
    app: 'BarberTime API',
    version: '1.0.0',
    status: 'running',
  });
});

/* SWAGGER */
const swaggerDocument = YAML.load('./src/docs/swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* ROTAS DA API */
app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);

/* TRATAMENTO DE ERROS (SEMPRE POR ÚLTIMO) */
app.use(errorHandler);

export default app;
