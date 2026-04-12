import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { userRouter } from './routes/user.route.js';
import { productRouter } from './routes/product.route.js';
import { categoryRouter } from './routes/category.route.js';
import { cartRouter } from './routes/cart.route.js';
import { addressRouter } from './routes/address.route.js';
import { orderRouter } from './routes/order.route.js';
import { adminRouter } from './routes/admin.route.js';
import { bannerRouter } from './routes/banner.route.js';
import { discountRouter } from './routes/discount.route.js';
import { chatRouter } from './routes/chat.route.js';
import { reviewRouter } from './routes/review.route.js';
import { contactRouter } from './routes/contact.route.js';

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
  helmet({
    crossOriginEmbedderPolicy: false,
  }),
);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the VintunaStore' });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/addresses', addressRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/banners', bannerRouter);
app.use('/api/v1/discounts', discountRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/contact', contactRouter);

export default app;
