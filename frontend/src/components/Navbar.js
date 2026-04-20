import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingBag, FaHeart, FaUser, FaSearch, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { logout } from '../redux/store';
import './Navbar.css';

const Navbar = () => {
  const cart = useSelector((state) => state.cart.items);
  const wishlist = useSelector((state) => state.wishlist.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${searchQuery}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setUserDropdown(false);
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">The Rich Mens's wear</Link>

        <div className="navbar-categories">
          {['men', 'women', 'kids'].map((cat) => (
            <Link key={cat} to={`/category/${cat}`} className="nav-link">
              {cat.toUpperCase()}
            </Link>
          ))}
          <Link to="/products?category=Home" className="nav-link">HOME & LIVING</Link>
          <Link to="/products?category=Beauty" className="nav-link">BEAUTY</Link>
          <Link to="/products" className="nav-link studio-link">STUDIO</Link>
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="navbar-icons">
          <div className="nav-icon-wrapper" onClick={() => setUserDropdown(!userDropdown)}>
            <FaUser />
            <span>{isAuthenticated ? user?.name?.split(' ')[0] : 'Profile'}</span>
            <FaChevronDown size={10} />
            {userDropdown && (
              <div className="dropdown-menu">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setUserDropdown(false)}>My Profile</Link>
                    <Link to="/orders" onClick={() => setUserDropdown(false)}>Orders</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserDropdown(false)}>Admin Panel</Link>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setUserDropdown(false)}>Login</Link>
                    <Link to="/register" onClick={() => setUserDropdown(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/wishlist" className="nav-icon-wrapper">
            <FaHeart />
            <span>Wishlist</span>
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>

          <Link to="/cart" className="nav-icon-wrapper">
            <FaShoppingBag />
            <span>Bag</span>
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </Link>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {mobileMenu && (
        <div className="mobile-menu">
          {['men', 'women', 'kids'].map((cat) => (
            <Link key={cat} to={`/category/${cat}`} onClick={() => setMobileMenu(false)}>
              {cat.toUpperCase()}
            </Link>
          ))}
          <Link to="/cart" onClick={() => setMobileMenu(false)}>Cart ({totalItems})</Link>
          <Link to="/wishlist" onClick={() => setMobileMenu(false)}>Wishlist</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMobileMenu(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
