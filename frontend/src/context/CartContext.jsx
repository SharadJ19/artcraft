import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Helper function to get product ID (MongoDB ObjectId)
  const getProductId = (product) => {
    return product._id;
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Find if this product is already in cart
      const existingItemIndex = prevCart.findIndex(item => {
        const itemId = item.product ? getProductId(item.product) : getProductId(item);
        const newProductId = getProductId(product);
        return itemId === newProductId;
      });
      
      if (existingItemIndex >= 0) {
        // If already in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity = 
          (updatedCart[existingItemIndex].quantity || 1) + quantity;
        return updatedCart;
      } else {
        // If not in cart, add new item
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => {
      // Handle both formats: items with product property and direct product items
      const itemProductId = item.product 
        ? item.product._id
        : item._id;
      return itemProductId !== productId;
    }));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item => {
        // Get MongoDB _id
        const itemProductId = item.product 
          ? item.product._id
          : item._id;
        return itemProductId === productId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product ? item.product.price : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getProductId
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 