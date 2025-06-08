import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Menu, X, MapPin, Globe, User, LogOut } from 'lucide-react';
import { logout } from '../../redux/authSlice';
import ThemeToggle from './ThemeToggle.jsx';

const Navbar = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage 
          ? 'bg-white shadow-sm dark:bg-black dark:shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-primary-400" />
            <span className="text-xl font-bold text-primary-400">Voyager AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={` ${ isScrolled || !isHomePage ? 'text-gray-300 hover:text-primary-600 font-medium' : 'text-gray-700 hover:text-primary-600 font-medium'} `}>Home</Link>
            <Link to="/about" className={` ${ isScrolled || !isHomePage ? 'text-gray-300 hover:text-primary-600 font-medium' : 'text-gray-700 hover:text-primary-600 font-medium'} `}>About</Link>
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium">
                  <span>{user?.name || 'User'}</span>
                  <User className="w-5 h-5" />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="py-2">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="mr-4 p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="container-custom py-4 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary-600"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="space-y-3 pt-2">
                <Link 
                  to="/login" 
                  className="block w-full text-center py-2 text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;