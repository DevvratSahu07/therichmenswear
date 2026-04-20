import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getProducts } from '../api/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const categories = [
  { name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300', link: '/category/men' },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300', link: '/category/women' },
  { name: 'Kids', image: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=300', link: '/category/kids' },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', link: '/products?category=Shoes' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300', link: '/products?category=Bags' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300', link: '/products?category=Beauty' },
];

const banners = [
  { image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200', title: 'Summer Sale', subtitle: 'Up to 70% off', link: '/products' },
  { image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200', title: 'New Arrivals', subtitle: 'Shop the latest trends', link: '/products' },
  { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200', title: 'Footwear Fest', subtitle: 'Huge collection of shoes', link: '/products?category=Shoes' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    getFeaturedProducts().then((res) => setFeatured(res.data.products));
    getProducts({ limit: 8, sort: 'newest' }).then((res) => setNewArrivals(res.data.products));

    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <img src={banners[currentBanner].image} alt="banner" className="banner-img" />
        <div className="banner-overlay">
          <h1>{banners[currentBanner].title}</h1>
          <p>{banners[currentBanner].subtitle}</p>
          <Link to={banners[currentBanner].link} className="shop-now-btn">SHOP NOW</Link>
        </div>
        <div className="banner-dots">
          {banners.map((_, i) => (
            <span key={i} className={`dot ${i === currentBanner ? 'active' : ''}`} onClick={() => setCurrentBanner(i)} />
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="section">
        <h2 className="section-title">SHOP BY CATEGORY</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to={cat.link} key={cat.name} className="category-card">
              <img src={cat.image} alt={cat.name} />
              <p>{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">FEATURED PRODUCTS</h2>
          <Link to="/products" className="view-all">VIEW ALL</Link>
        </div>
        <div className="products-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <div className="promo-section">
        <div className="promo-card">
          <h3>🚚 FREE SHIPPING</h3>
          <p>On orders above ₹499</p>
        </div>
        <div className="promo-card">
          <h3>🔄 EASY RETURNS</h3>
          <p>30-day hassle-free returns</p>
        </div>
        <div className="promo-card">
          <h3>🔒 SECURE PAYMENT</h3>
          <p>100% secure transactions</p>
        </div>
        <div className="promo-card">
          <h3>💎 PREMIUM BRANDS</h3>
          <p>Top fashion brands only</p>
        </div>
      </div>

      {/* New Arrivals */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">NEW ARRIVALS</h2>
          <Link to="/products?sort=newest" className="view-all">VIEW ALL</Link>
        </div>
        <div className="products-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;