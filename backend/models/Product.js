const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    finalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sizes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    colors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    numReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gender: {
      type: DataTypes.ENUM('men', 'women', 'kids', 'unisex'),
      defaultValue: 'unisex',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Product;