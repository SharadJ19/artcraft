import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import { FALLBACK_IMAGE_SMALL } from '../utils/images';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md">
        <nav className="space-y-2">
          <Link
            to="/admin"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
          >
            Products
          </Link>
          <Link
            to="/admin/orders"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
          >
            Orders
          </Link>
        </nav>
      </div>
      <div className="md:col-span-3">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Routes>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    lowStock: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [orders, products] = await Promise.all([
        api.get('/api/orders'),
        api.get('/api/products')
      ]);

      setStats({
        totalOrders: orders.data.length,
        totalProducts: products.data.length,
        lowStock: products.data.filter(p => p.stock < 5).length
      });
    } catch (error) {
      toast.error('Error fetching statistics');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
        <p className="text-3xl font-bold">{stats.totalOrders}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Total Products</h3>
        <p className="text-3xl font-bold">{stats.totalProducts}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Low Stock Items</h3>
        <p className="text-3xl font-bold">{stats.lowStock}</p>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      if (selectedProduct) {
        await api.put(`/api/products/${selectedProduct._id}`, 
          Object.fromEntries(formData));
      } else {
        await api.post('/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      fetchProducts();
      setShowForm(false);
      setSelectedProduct(null);
      toast.success(`Product ${selectedProduct ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error.message);
      toast.error(`Error saving product: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/api/products/${id}`);
      fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {selectedProduct ? 'Edit Product' : 'New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={selectedProduct?.name}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                defaultValue={selectedProduct?.description}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Price</label>
              <input
                type="number"
                name="price"
                defaultValue={selectedProduct?.price}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                defaultValue={selectedProduct?.category}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                defaultValue={selectedProduct?.stock}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {!selectedProduct && (
              <div>
                <label className="block text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            )}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {selectedProduct ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedProduct(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="h-10 w-10 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE_SMALL;
                      }}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  ${product.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order._id.slice(-6)}
                </td>
                <td className="px-6 py-4">
                  {order.user ? (
                    <>
                      <div className="text-sm text-gray-900">{order.user.name}</div>
                      <div className="text-sm text-gray-500">{order.user.email}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">User data unavailable</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  ${order.totalAmount?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'}`}
                  >
                    {order.status || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard; 