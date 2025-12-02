import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

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

export default app;