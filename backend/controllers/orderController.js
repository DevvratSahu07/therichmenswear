const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyOrders, getOrderById, getAllOrders, updateOrderStatus };