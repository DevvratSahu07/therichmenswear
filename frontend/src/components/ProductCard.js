import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { addToWishlistAPI, removeFromWishlistAPI } from '../api/api';
import { addToWishlistLocal, removeFromWishlistLocal } from '../redux/store';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isWishlisted = wishlist.some((item) => item.ProductId === product.id || item.id === product.id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please login to add to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlistAPI(product.id);
        dispatch(removeFromWishlistLocal(product.id));
        toast.info('Removed from wishlist');
      } else {
        await addToWishlistAPI(product.id);
        dispatch(addToWishlistLocal({ ...product, ProductId: product.id }));
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating wishlist');
    }
  };

  const discountedPrice = product.finalPrice || (product.price - (product.price * product.discount) / 100);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="card-image-wrapper">
          <img
            src={product.image || 'https://via.placeholder.com/300x400'}
            alt={product.name}
            className="card-image"
          />
          {product.discount > 0 && (
            <span className="discount-tag">{product.discount}% OFF</span>
          )}
          <button className="wishlist-btn" onClick={handleWishlist}>
            {isWishlisted ? <FaHeart style={{ color: '#ff3f6c' }} /> : <FaRegHeart />}
          </button>
        </div>
        <div className="card-info">
          <h4 className="card-brand">{product.brand}</h4>
          <p className="card-name">{product.name}</p>
          <div className="card-price">
            <span className="current-price">₹{Math.round(discountedPrice)}</span>
            {product.discount > 0 && (
              <>
                <span className="original-price">₹{product.price}</span>
                <span className="discount-percent">({product.discount}% OFF)</span>
              </>
            )}
          </div>
          {product.rating > 0 && (
            <div className="card-rating">
              <FaStar style={{ color: '#ffb74d' }} />
              <span>{product.rating}</span>
              <span className="reviews">({product.numReviews})</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;