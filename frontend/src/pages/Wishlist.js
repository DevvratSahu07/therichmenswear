import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { getWishlist, removeFromWishlistAPI } from '../api/api';
import { setWishlist, removeFromWishlistLocal } from '../redux/store';
import { toast } from 'react-toastify';
import './Wishlist.css';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    getWishlist().then((res) => dispatch(setWishlist(res.data.items)));
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlistAPI(productId);
      dispatch(removeFromWishlistLocal(productId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Error removing item');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="empty-wishlist">
        <div style={{ fontSize: '60px' }}>💔</div>
        <h2>Your Wishlist is empty</h2>
        <p>Save items you love here.</p>
        <Link to="/products" className="shop-btn">START SHOPPING</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2>My Wishlist ({wishlist.length} items)</h2>
      <div className="wishlist-grid">
        {wishlist.map((item) => {
          const product = item.Product || item;
          return (
            <div key={item.id} className="wishlist-card">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} />
                <h4>{product.brand}</h4>
                <p>{product.name}</p>
                <strong>₹{Math.round(product.finalPrice || product.price)}</strong>
              </Link>
              <button className="remove-wishlist-btn" onClick={() => handleRemove(product.id)}>
                <FaTrash /> REMOVE
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;