import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmat from 'helmet';
import { userRouter } from './routes/user.route.js';

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmat({
    crossOriginEmbedderPolicy: false,
  }),
);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the VintunaStore' });
});

app.use('/api/v1/users', userRouter);
export default app;
