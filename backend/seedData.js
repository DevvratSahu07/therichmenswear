require('dotenv').config();
const { sequelize } = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const products = [
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Premium quality cotton t-shirt for everyday wear. Soft, breathable, and comfortable.',
    price: 999,
    discount: 30,
    finalPrice: 699,
    category: 'T-Shirts',
    subCategory: 'Casual',
    brand: 'H&M',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Blue'],
    stock: 100,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    rating: 4.2,
    numReviews: 128,
    isFeatured: true,
    gender: 'men',
  },
  {
    name: 'Floral Wrap Dress',
    description: 'Beautiful floral print wrap dress perfect for summer outings.',
    price: 2499,
    discount: 40,
    finalPrice: 1499,
    category: 'Dresses',
    subCategory: 'Casual',
    brand: 'Zara',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Print', 'Pink'],
    stock: 50,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'],
    rating: 4.5,
    numReviews: 89,
    isFeatured: true,
    gender: 'women',
  },
  {
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with stretch comfort technology.',
    price: 2999,
    discount: 25,
    finalPrice: 2249,
    category: 'Jeans',
    subCategory: 'Slim Fit',
    brand: "Levi's",
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Blue', 'Black', 'Grey'],
    stock: 75,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
    rating: 4.3,
    numReviews: 215,
    isFeatured: true,
    gender: 'men',
  },
  {
    name: 'Formal Blazer',
    description: 'Premium formal blazer for office and special occasions.',
    price: 4999,
    discount: 20,
    finalPrice: 3999,
    category: 'Blazers',
    subCategory: 'Formal',
    brand: 'Raymond',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy Blue', 'Black', 'Grey'],
    stock: 30,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b8ef4?w=400',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b8ef4?w=400'],
    rating: 4.6,
    numReviews: 67,
    isFeatured: false,
    gender: 'men',
  },
  {
    name: 'Summer Kurti',
    description: 'Beautiful cotton kurti perfect for Indian summers.',
    price: 1299,
    discount: 35,
    finalPrice: 844,
    category: 'Kurtis',
    subCategory: 'Casual',
    brand: 'Biba',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Yellow', 'Pink', 'White'],
    stock: 60,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400',
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400'],
    rating: 4.4,
    numReviews: 156,
    isFeatured: true,
    gender: 'women',
  },
  {
    name: 'Sports Running Shoes',
    description: 'Lightweight and comfortable running shoes with advanced cushioning.',
    price: 3999,
    discount: 15,
    finalPrice: 3399,
    category: 'Shoes',
    subCategory: 'Sports',
    brand: 'Nike',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Blue'],
    stock: 45,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    rating: 4.7,
    numReviews: 342,
    isFeatured: true,
    gender: 'unisex',
  },
  {
    name: 'Kids Cartoon T-Shirt',
    description: 'Fun and colorful cartoon print t-shirt for kids.',
    price: 599,
    discount: 20,
    finalPrice: 479,
    category: 'T-Shirts',
    subCategory: 'Kids Wear',
    brand: 'H&M Kids',
    sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
    colors: ['Red', 'Blue', 'Green'],
    stock: 80,
    image: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=400',
    images: ['https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=400'],
    rating: 4.1,
    numReviews: 93,
    isFeatured: false,
    gender: 'kids',
  },
  {
    name: 'Women Handbag',
    description: 'Premium leather handbag with multiple compartments.',
    price: 2499,
    discount: 10,
    finalPrice: 2249,
    category: 'Bags',
    subCategory: 'Handbags',
    brand: 'Lavie',
    sizes: ['Free Size'],
    colors: ['Brown', 'Black', 'Tan'],
    stock: 25,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    rating: 4.3,
    numReviews: 78,
    isFeatured: false,
    gender: 'women',
  },
];

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@myntra.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('✅ Admin user created');

    const hashedPass2 = await bcrypt.hash('user123', 12);
    await User.create({
      name: 'Test User',
      email: 'user@myntra.com',
      password: hashedPass2,
      role: 'user',
    });
    console.log('✅ Test user created');

    await Product.bulkCreate(products);
    console.log('✅ Products seeded');

    console.log('\n🎉 Database seeded successfully!');
    console.log('Admin: admin@myntra.com / admin123');
    console.log('User:  user@myntra.com  / user123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();