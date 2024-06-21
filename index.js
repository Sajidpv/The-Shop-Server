import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import categoryRoutes from './routes/category.js';
import subCategoryRoutes from './routes/subCategory.js';
import brandRoutes from './routes/brand.js';
import variantTypeRoutes from './routes/variantType.js';
import variantRoutes from './routes/variant.js';
import productRoutes from './routes/product.js';
import couponCodeRoutes from './routes/couponCode.js';
import posterRoutes from './routes/poster.js';
import userRoutes from './routes/user.js';
import orderRoutes from './routes/order.js';
import paymentRoutes from './routes/payment.js';
import notificationRoutes from './routes/notification.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Setting static folder path
app.use('/image/products', express.static('public/products'));
app.use('/image/category', express.static('public/category'));
app.use('/image/poster', express.static('public/posters'));

const URL = process.env.MONGO_URL;
mongoose.connect(URL);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Routes
app.use('/categories', categoryRoutes);
app.use('/subCategories', subCategoryRoutes);
app.use('/brands', brandRoutes);
app.use('/variantTypes', variantTypeRoutes);
app.use('/variants', variantRoutes);
app.use('/products', productRoutes);
app.use('/couponCodes', couponCodeRoutes);
app.use('/posters', posterRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/notification', notificationRoutes);

// Example route using asyncHandler directly in app.js
app.get('/', asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'API working successfully', data: null });
}));

// Global error handler
app.use((error, req, res, next) => {
    res.status(500).json({ success: false, message: error.message, data: null });
});

app.listen(process.env.PORT, () => {
    console.log("\x1b[1;31;47m%s\x1b[0m",`Server running on Port:${process.env.PORT}`);
   
});
