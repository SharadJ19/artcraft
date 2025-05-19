import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    paymentMethod: 'cod'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.street.trim()) {
      toast.error('Street address is required');
      return false;
    }
    if (!formData.city.trim()) {
      toast.error('City is required');
      return false;
    }
    if (!formData.state.trim()) {
      toast.error('State is required');
      return false;
    }
    if (!formData.zipCode.trim()) {
      toast.error('ZIP code is required');
      return false;
    }
    return true;
  };

  const validateCartItems = () => {
    let validationError = false;
    
    for (const item of cart) {
      const product = item.product || item;
      
      if (!product || (!product._id && !product.id)) {
        toast.error('One or more products in your cart are invalid');
        validationError = true;
        break;
      }
    }
    
    return !validationError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!validateCartItems()) return;
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You need to be logged in to place an order');
        navigate('/login');
        return;
      }
      
      try {
        await api.get('/api/auth/me');
      } catch (authError) {
        toast.error('Authentication issue. Please log in again.');
        navigate('/login');
        return;
      }

      const orderItems = cart.map(item => {
        // Get the product object from the item
        const product = item.product || item;
        
        // MongoDB ObjectId is stored as _id
        if (!product._id) {
          console.error('Product missing _id:', product);
          toast.error(`Product ${product.name} has an invalid format`);
          throw new Error('Invalid product data: Missing MongoDB _id');
        }
        
        return {
          product: product._id,
          quantity: parseInt(item.quantity),
          price: parseFloat(product.price)
        };
      });

      const orderData = {
        items: orderItems,
        shippingAddress: formData,
        totalAmount: getTotal(),
        paymentMethod: formData.paymentMethod
      };

      console.log('Sending order data:', JSON.stringify(orderData));
      const response = await api.post('/api/orders', orderData);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Order submission error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          toast.error('Authentication error. Please log in again.');
          navigate('/login');
        } else if (error.response.status === 404) {
          toast.error('Order service not available. Please try again later.');
        } else {
          toast.error(error.response.data?.message || 'Failed to place order');
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item, index) => {
          const product = item.product || item;
          const productId = product._id || product.id;
          return (
            <div key={`checkout-item-${productId}-${index}`} className="flex justify-between mb-2">
              <span>{product.name} x {item.quantity}</span>
              <span>${(product.price * item.quantity).toFixed(2)}</span>
            </div>
          );
        })}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">${getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="cod">Cash on Delivery</option>
              <option value="upi" disabled>UPI (Coming Soon)</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout; 