import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db_connection.js';
import usersRoute from './routes/userRoutes.js';
import authRoute from './routes/authRoutes.js';
import vendorRoute from './routes/vendorRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import productRoute from './routes/productRoutes.js';
import orderRoute from './routes/orderRoutes.js';
import notificationRoute from './routes/notificationRoutes.js';
import adminDashboardRoute from './routes/dashboard/adminDashboardRoutes.js';
import vendorDashboardRoute from './routes/dashboard/vendorDashboardRoutes.js';
import customerDashboardRoute from './routes/dashboard/customerDashboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'

import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const allowedOrigins = process.env.CLIENT_URLS?.split(",").map(url => url.trim());
console.log("Allowed Origins:", allowedOrigins);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({
  limit: '10mb' // Increase the limit to 50mb
}));
app.use(cookieParser());
connectDB();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/vendors", vendorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/admin/dashboard", adminDashboardRoute);
app.use("/api/vendor/dashboard", vendorDashboardRoute);
app.use("/api/customer/dashboard", customerDashboardRoute);
app.use("/api/payments", paymentRoutes);
app.use("/api/transactions", transactionRoutes)

export default app;
