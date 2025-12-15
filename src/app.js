import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    app: 'BarberTime',
    version: '1.0.0',
  });
});

app.use('/api', routes);
app.use(errorHandler);
app.use(express.json());

/* 🔹 SWAGGER CONFIG */
const swaggerDocument = YAML.load(
  path.resolve("src/docs/swagger.yaml")
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* 🔹 ROTAS */
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);

export default app;