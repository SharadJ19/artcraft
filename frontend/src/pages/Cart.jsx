import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/api';
import { FALLBACK_IMAGE_SMALL } from '../utils/images';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Cart Items ({cart.length})</h2>
            </div>
            {cart.map((item, index) => {
              const product = item.product || item;
              const productId = product._id || product.id;
              
              return (
                <div
                  key={`cart-item-${productId}-${index}`}
                  className="p-6 border-b border-gray-200 last:border-b-0 flex flex-col sm:flex-row items-start sm:items-center"
                >
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-50 rounded p-1 flex items-center justify-center">
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="max-h-20 max-w-full object-contain product-image-hover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE_SMALL;
                      }}
                    />
                  </div>
                  <div className="flex-grow ml-0 sm:ml-6 mt-4 sm:mt-0">
                    <div className="flex justify-between">
                      <Link to={`/products/${productId}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                        {product.name}
                      </Link>
                      <span className="text-lg font-bold text-gray-800">${(product.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">${product.price.toFixed(2)} each</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <button
                          onClick={() => updateQuantity(productId, item.quantity - 1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          -
                        </button>
                        <span className="w-10 text-center py-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(productId, item.quantity + 1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(productId)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-xl text-blue-600">${getTotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/"
                className="block w-full text-center text-blue-600 hover:text-blue-800 mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 