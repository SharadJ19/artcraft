import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api, { getImageUrl } from '../utils/api';
import { FALLBACK_IMAGE_MEDIUM } from '../utils/images';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md mb-8 p-6 md:p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Quality Art & Craft Supplies</h1>
        <p className="text-lg mb-6 max-w-2xl">
          Find all the supplies you need for your artistic projects. From painting to drawing, we have everything to bring your creativity to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#products" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors inline-block text-center">
            Shop Now
          </a>
          {!user && (
            <Link to="/register" className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors inline-block text-center">
              Create Account
            </Link>
          )}
        </div>
      </div>
      
      <h2 id="products" className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow border border-gray-100"
          >
            <Link to={`/products/${product._id}`} className="block h-48 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                className="max-h-44 max-w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE_MEDIUM;
                }}
              />
            </Link>
            <div className="p-4 flex-grow flex flex-col">
              <Link to={`/products/${product._id}`} className="hover:text-blue-600">
                <h2 className="text-base font-medium text-gray-800 mb-1 line-clamp-1">{product.name}</h2>
              </Link>
              <p className="text-gray-600 text-sm line-clamp-2 h-10 mb-3">{product.description}</p>
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/products/${product._id}`}
                    className="text-blue-600 border border-blue-600 px-3 py-2 rounded text-center text-sm hover:bg-blue-50 transition-colors"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 