import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import tableRoutes from './routes/tables.js';
import reservationRoutes from './routes/reservations.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, app: 'DineSphere API' }));

app.use('/api', authRoutes);
app.use('/api', menuRoutes);
app.use('/api', tableRoutes);
app.use('/api', reservationRoutes);

app.use((err, _req, res, _next) => {
  console.error('Handler:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

export default app;
