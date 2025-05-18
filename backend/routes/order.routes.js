const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all orders (Admin only)
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    // Use populate with optional chaining to handle missing users
    const orders = await Order.find()
      .populate({ 
        path: 'user', 
        select: 'name email',
        // Handle the case where the user might have been deleted
        match: { _id: { $ne: null } } 
      })
      .populate('items.product', 'name price');
    
    // Ensure the response has a valid structure even if user is null
    const safeOrders = orders.map(order => {
      const orderObj = order.toObject();
      if (!orderObj.user) {
        orderObj.user = { name: 'Unknown User', email: 'deleted@user.com' };
      }
      return orderObj;
    });
    
    res.json(safeOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price imageUrl',
        // Handle the case where a product might have been deleted
        match: { _id: { $ne: null } }
      });
    
    // Ensure the response has valid structure even if products are null
    const safeOrders = orders.map(order => {
      const orderObj = order.toObject();
      
      // If any product is null, replace with placeholder data
      orderObj.items = orderObj.items.map(item => {
        if (!item.product) {
          item.product = { 
            _id: 'removed',
            name: 'Product No Longer Available', 
            price: item.price,
            imageUrl: '' 
          };
        }
        return item;
      });
      
      return orderObj;
    });
    
    res.json(safeOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order items' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Valid shipping address is required' });
    }

    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ message: 'Valid total amount is required' });
    }

    // Process items to ensure they have valid MongoDB ObjectIds
    const processedItems = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Check for quantity
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity at item ${i + 1}` });
      }
      
      // Check for price
      if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
        return res.status(400).json({ message: `Invalid price at item ${i + 1}` });
      }
      
      // Check product ID
      if (!item.product) {
        return res.status(400).json({ message: `Missing product ID at item ${i + 1}` });
      }
      
      // Validate MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: `Invalid product ID format at item ${i + 1}` });
      }

      // Check if product exists
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }
      
      // Add the processed item with valid ObjectId
      processedItems.push({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      });
    }

    // Check stock and update it
    for (let item of processedItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user.id,
      items: processedItems,
      shippingAddress,
      totalAmount
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    // MongoDB error
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(400).json({ message: 'Database error', error: error.message });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (Admin only)
router.put('/:id/status', [auth, isAdmin], async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 