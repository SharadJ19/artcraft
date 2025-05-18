import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">ArtCraft</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            
            <Link to="/cart" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium relative">
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link to="/my-account" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                  My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium" onClick={toggleMenu}>
            Home
          </Link>
          
          <Link to="/cart" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium relative" onClick={toggleMenu}>
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="ml-2 inline-block bg-red-500 text-white rounded-full w-5 h-5 text-xs text-center leading-5">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/my-account" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium" onClick={toggleMenu}>
                My Orders
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium" onClick={toggleMenu}>
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium" onClick={toggleMenu}>
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-gray-50 font-medium"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 