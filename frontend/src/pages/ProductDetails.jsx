import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import api, { getImageUrl } from '../utils/api';
import { FALLBACK_IMAGE_LARGE } from '../utils/images';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      toast.error('Error fetching product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && (!product._id && !product.id)) {
      product._id = id;
    }
    
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:grid md:grid-cols-2 md:gap-6">
        <div className="p-4 flex items-center justify-center bg-gray-50">
          <div className="relative h-52 w-full max-w-xs mx-auto">
            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="h-full max-h-52 mx-auto object-contain product-image-hover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE_LARGE;
              }}
            />
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="mb-2 text-sm text-blue-600">
            <Link to="/" className="hover:underline">← Back to products</Link>
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>
          
          <div className="mb-3">
            <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
          </div>
          
          <div className="mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
          </div>
          
          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center px-2 py-1">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 