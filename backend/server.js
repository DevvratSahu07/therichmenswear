const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, connectDB } = require('./config/db');

// Import Models (to register associations)
require('./models/User');
require('./models/Product');
require('./models/Order');
require('./models/Review');
require('./models/Wishlist');
require('./models/Address');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const addressRoutes = require('./routes/addressRoutes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);

app.get('/', (req, res) => res.json({ message: "The Rich Mens's wear API Running" }));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log('✅ Database tables synced');
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
};

startServer();
