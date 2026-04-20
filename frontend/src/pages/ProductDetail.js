import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaHeart, FaRegHeart, FaShoppingBag, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa';
import { getProductById, getReviews, addReview } from '../api/api';
import { addToCart } from '../redux/store';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([getProductById(id), getReviews(id)]);
        setProduct(prodRes.data.product);
        setReviews(revRes.data.reviews);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    dispatch(addToCart({ ...product, selectedSize }));
    toast.success('Added to bag!');
  };

  const handleBuyNow = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    dispatch(addToCart({ ...product, selectedSize }));
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please login to submit a review');
      return;
    }
    try {
      const res = await addReview(id, reviewForm);
      setReviews([res.data.review, ...reviews]);
      setShowReviewForm(false);
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="loading">Product not found</div>;

  const finalPrice = product.finalPrice || (product.price - (product.price * product.discount) / 100);
  const allImages = product.images?.length ? product.images : [product.image];

  return (
    <div className="product-detail">
      <div className="pd-images">
        <div className="image-thumbnails">
          {allImages.map((img, i) => (
            <img
              key={i}
              src={img || 'https://via.placeholder.com/80'}
              alt=""
              className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
              onClick={() => setSelectedImage(i)}
            />
          ))}
        </div>
        <div className="main-image-wrapper">
          <img
            src={allImages[selectedImage] || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="main-image"
          />
          {product.discount > 0 && (
            <span className="pd-discount-badge">{product.discount}% OFF</span>
          )}
        </div>
      </div>

      <div className="pd-info">
        <h1 className="pd-brand">{product.brand}</h1>
        <h2 className="pd-name">{product.name}</h2>

        {product.rating > 0 && (
          <div className="pd-rating">
            <span className="rating-badge">
              {product.rating} <FaStar />
            </span>
            <span className="rating-count">{product.numReviews} Ratings</span>
          </div>
        )}

        <div className="pd-price">
          <span className="pd-current-price">₹{Math.round(finalPrice)}</span>
          {product.discount > 0 && (
            <>
              <span className="pd-original-price">₹{product.price}</span>
              <span className="pd-discount">({product.discount}% OFF)</span>
            </>
          )}
        </div>

        {product.sizes?.length > 0 && (
          <div className="pd-sizes">
            <h4>SELECT SIZE</h4>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pd-actions">
          <button className="add-to-bag-btn" onClick={handleAddToCart}>
            <FaShoppingBag /> ADD TO BAG
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow}>
            BUY NOW
          </button>
        </div>

        <div className="pd-features">
          <div className="feature-item"><FaTruck /> <span>Free delivery on orders above ₹499</span></div>
          <div className="feature-item"><FaUndo /> <span>30-day easy returns</span></div>
          <div className="feature-item"><FaShieldAlt /> <span>100% authentic products</span></div>
        </div>

        <div className="pd-description">
          <h4>PRODUCT DETAILS</h4>
          <p>{product.description}</p>
          {product.colors?.length > 0 && (
            <p><strong>Color:</strong> {product.colors.join(', ')}</p>
          )}
          {product.category && <p><strong>Category:</strong> {product.category}</p>}
          <p><strong>Brand:</strong> {product.brand}</p>
        </div>

        {/* Reviews */}
        <div className="pd-reviews">
          <div className="reviews-header">
            <h4>RATINGS & REVIEWS</h4>
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="write-review-btn">
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    style={{ color: star <= reviewForm.rating ? '#ffb74d' : '#ddd', cursor: 'pointer', fontSize: '24px' }}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="Review title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
              />
              <textarea
                placeholder="Write your review..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={4}
              />
              <button type="submit">SUBMIT REVIEW</button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-rating">
                  <span className="rating-badge small">
                    {review.rating} <FaStar />
                  </span>
                  <span className="reviewer-name">{review.User?.name || 'User'}</span>
                </div>
                {review.title && <h5>{review.title}</h5>}
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;