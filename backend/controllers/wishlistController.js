const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Product }],
    });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const existing = await Wishlist.findOne({
      where: { UserId: req.user.id, ProductId: productId },
    });
    if (existing) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }
    const item = await Wishlist.create({ UserId: req.user.id, ProductId: productId });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.destroy({
      where: { UserId: req.user.id, ProductId: req.params.productId },
    });
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };