const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Product = require('./Product');

const Wishlist = sequelize.define(
  'Wishlist',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Wishlist);
Wishlist.belongsTo(User);
Product.hasMany(Wishlist);
Wishlist.belongsTo(Product);

module.exports = Wishlist;