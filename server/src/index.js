import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import Planet from './models/Planet.js';
import { connectDb, seedDbIfEmpty } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vutru';

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/planets', async (_req, res, next) => {
  try {
    const planets = await Planet.find().sort({ id: 1 }).lean();
    res.json({ planets });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  res.status(500).json({
    message: error.message || 'Internal Server Error',
  });
});

const startServer = async () => {
  await connectDb(MONGODB_URI);
  await seedDbIfEmpty();

  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
