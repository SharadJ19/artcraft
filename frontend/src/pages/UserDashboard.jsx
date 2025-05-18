import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getImageUrl } from '../utils/api';
import { FALLBACK_IMAGE_SMALL } from '../utils/images';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      const response = await api.get('/api/orders/my-orders');
      
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch your orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Back to Shop
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You don't have any orders yet.</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="text-sm text-gray-500">Order ID: {order._id}</div>
                  <div className="text-sm text-gray-500">Placed on: {formatDate(order.createdAt)}</div>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium mb-3">Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded overflow-hidden mr-3">
                          {item.product.imageUrl ? (
                            <img 
                              src={getImageUrl(item.product.imageUrl)} 
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = FALLBACK_IMAGE_SMALL;
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              N/A
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Shipping Address:</div>
                  <address className="text-sm text-gray-600 not-italic">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </address>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard; 