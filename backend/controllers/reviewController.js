const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');

const addReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const productId = req.params.productId;

    const existing = await Review.findOne({
      where: { UserId: req.user.id, ProductId: productId },
    });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    const review = await Review.create({
      rating,
      comment,
      title,
      UserId: req.user.id,
      ProductId: productId,
    });

    const reviews = await Review.findAll({ where: { ProductId: productId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.update(
      { rating: avgRating.toFixed(1), numReviews: reviews.length },
      { where: { id: productId } }
    );

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { ProductId: req.params.productId },
      include: [{ model: User, attributes: ['name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getProductReviews };