import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/api';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const sortOptions = [
  { label: 'Recommended', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Rating', value: 'rating' },
  { label: 'Discount', value: 'discount' },
];

const categories = ['T-Shirts', 'Jeans', 'Dresses', 'Kurtis', 'Blazers', 'Shoes', 'Bags', 'Accessories'];
const brands = ['H&M', 'Zara', "Levi's", 'Nike', 'Adidas', 'Biba', 'Raymond', 'Lavie'];

const ProductList = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [filters, setFilters] = useState({ brand: '', minPrice: '', maxPrice: '' });
  const [showFilter, setShowFilter] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery, categoryQuery, sort, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort,
        ...(category && { gender: category }),
        ...(categoryQuery && { category: categoryQuery }),
        ...(searchQuery && { search: searchQuery }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      };
      const res = await getProducts(params);
      setProducts(res.data.products);
      setTotalProducts(res.data.totalProducts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({ brand: '', minPrice: '', maxPrice: '' });
    setSort('');
  };

  return (
    <div className="product-list-page">
      <div className="pl-header">
        <h2>
          {category ? `${category.toUpperCase()}'S FASHION` : searchQuery ? `Search: "${searchQuery}"` : 'ALL PRODUCTS'}
        </h2>
        <span className="product-count">{totalProducts} items</span>
        <div className="sort-filter">
          <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
            ☰ FILTER
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pl-content">
        <aside className={`filter-sidebar ${showFilter ? 'show' : ''}`}>
          <div className="filter-header">
            <h3>FILTERS</h3>
            <button onClick={clearFilters} className="clear-btn">CLEAR ALL</button>
          </div>

          <div className="filter-section">
            <h4>BRAND</h4>
            {brands.map((b) => (
              <label key={b} className="filter-checkbox">
                <input
                  type="radio"
                  name="brand"
                  value={b}
                  checked={filters.brand === b}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                />
                {b}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>PRICE RANGE</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>

          <button className="apply-filter-btn" onClick={applyFilters}>APPLY FILTERS</button>
        </aside>

        <div className="products-area">
          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image" />
                  <div className="skeleton-text" />
                  <div className="skeleton-text short" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try different filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              <div className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;