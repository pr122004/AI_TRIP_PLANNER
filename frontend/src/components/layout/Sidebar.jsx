import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, PlusCircle, Map, Calendar, Settings, User } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const navItems = [
    { path: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/trips/new', icon: <PlusCircle className="w-5 h-5" />, label: 'New Trip' },
    { path: '/trips', icon: <Map className="w-5 h-5" />, label: 'My Trips' },
    { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg md:shadow-none pt-20 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg ${
                      isActive
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    } group transition-all duration-200`
                  }
                >
                  <div className={`transition-colors duration-200 group-hover:text-primary-600`}>
                    {item.icon}
                  </div>
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="pt-8 mt-8 border-t border-gray-200">
            <div className="px-3 py-4 bg-primary-50 rounded-lg">
              <h3 className="font-medium text-primary-900">Need Help?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Having trouble planning your trip? Our support team is ready to help.
              </p>
              <button className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-800">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;