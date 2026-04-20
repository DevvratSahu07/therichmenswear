const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      ),
      defaultValue: 'pending',
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: 'razorpay',
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User, { foreignKey: 'UserId' });

module.exports = Order;