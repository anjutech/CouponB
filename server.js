import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import couponRoutes from './src/routes/couponRoutes.js';
import logger from './src/utility/logger.js';
import helmet from "helmet";
import cors from "cors";
const app = express();
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
// Middleware
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/payment', paymentRoutes);
app.use('/coupon', couponRoutes);

export default app;
