import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="footer-section">
        <h4>ONLINE SHOPPING</h4>
        <Link to="/category/men">Men</Link>
        <Link to="/category/women">Women</Link>
        <Link to="/category/kids">Kids</Link>
        <Link to="/products?category=Shoes">Shoes</Link>
        <Link to="/products?category=Bags">Bags & Accessories</Link>
      </div>
      <div className="footer-section">
        <h4>CUSTOMER POLICIES</h4>
        <a href="#">Contact Us</a>
        <a href="#">FAQ</a>
        <a href="#">T&C</a>
        <a href="#">Terms Of Use</a>
        <a href="#">Track Orders</a>
        <a href="#">Returns</a>
      </div>
      <div className="footer-section">
        <h4>EXPERIENCE THE RICH MENS'S WEAR ON MOBILE</h4>
        <div className="app-buttons">
          <a href="/" className="app-badge">App Store</a>
          <a href="/" className="app-badge">Google Play</a>
        </div>
        <h4 style={{ marginTop: '15px' }}>KEEP IN TOUCH</h4>
        <div className="social-links">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">YouTube</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>(c) 2024 The Rich Mens's wear. All rights reserved.</p>
      <p style={{ color: '#ff3f6c', fontWeight: 700, marginTop: '5px' }}>100% SECURE PAYMENTS</p>
    </div>
  </footer>
);

export default Footer;
