import express from 'express';
import cors from 'cors';
import healthCheckRoute from './routes/healthCheck.routes.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
// import projectRouter from './routes/project.routes.js'
const app = express();

app.use(express.json({ limit: '16kb' }));

app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(express.static('public'));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  }),
);

app.use(cookieParser());

app.use('/api/healthCheck', healthCheckRoute);

app.use('/api/auth', authRouter);

export default app;
