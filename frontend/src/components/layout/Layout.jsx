import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Close sidebar on route change
  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  // Check if current page is dashboard or requires the sidebar
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/trips') || 
                          location.pathname.includes('/profile');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} />
      
      <div className="flex flex-1">
        {isAuthenticated && isDashboardPage && (
          <Sidebar isOpen={showSidebar} />
        )}
        
        <main className={`flex-1 transition-all duration-300 ${isAuthenticated && isDashboardPage ? 'ml-0 md:ml-64' : ''}`}>
          <div className="container-custom py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;