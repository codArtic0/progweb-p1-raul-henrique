import express from 'express';
import cors from 'cors';
import habitosRouter from './routes/habitos.js';
import registrosRouter from './routes/registros.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- Middleware global (antes das rotas) ---
// Em produção, a origem do front vem da variável CORS_ORIGIN.
const origens = (process.env.CORS_ORIGIN
  ?? 'http://localhost:5500,http://127.0.0.1:5500').split(',');
app.use(cors({ origin: origens }));
app.use(express.json()); // lê o body JSON para req.body
app.use(logger);         // loga toda requisição

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ api: 'TrackerFit API', versao: '1.0.0', rotas: ['/habitos', '/registros'] });
});

// --- Rotas ---
app.use('/habitos', habitosRouter);
app.use('/registros', registrosRouter);

// --- 404 para rotas que não existem ---
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// --- Tratador de erro: SEMPRE o último ---
app.use(errorHandler);

export default app;
