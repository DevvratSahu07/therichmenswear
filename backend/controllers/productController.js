const { Op } = require('sequelize');
const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      gender,
      brand,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const where = {};

    if (category) where.category = category;
    if (gender) where.gender = gender;
    if (brand) where.brand = brand;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
      ];
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    if (sort === 'price_desc') order = [['price', 'DESC']];
    if (sort === 'rating') order = [['rating', 'DESC']];
    if (sort === 'discount') order = [['discount', 'DESC']];

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      products,
      totalProducts: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, discount, category,
      subCategory, brand, sizes, colors, stock, gender, isFeatured,
    } = req.body;

    const finalPrice = price - (price * discount) / 100;
    let image = '';
    let images = [];

    if (req.files && req.files.length > 0) {
      image = `/uploads/${req.files[0].filename}`;
      images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    const product = await Product.create({
      name, description, price: parseFloat(price),
      discount: parseFloat(discount) || 0,
      finalPrice,
      category, subCategory, brand,
      sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',')) : [],
      colors: colors ? (Array.isArray(colors) ? colors : colors.split(',')) : [],
      stock: parseInt(stock) || 0,
      image, images, gender,
      isFeatured: isFeatured === 'true',
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updates = req.body;
    if (updates.price || updates.discount) {
      const price = parseFloat(updates.price) || product.price;
      const discount = parseFloat(updates.discount) || product.discount;
      updates.finalPrice = price - (price * discount) / 100;
    }

    if (req.files && req.files.length > 0) {
      updates.image = `/uploads/${req.files[0].filename}`;
      updates.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    await product.update(updates);
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isFeatured: true },
      limit: 8,
    });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
};