import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaHotel, FaFileAlt, FaChartPie, FaCog,
  FaSignOutAlt, FaBars, FaTimes, FaGlobe, FaMoon, FaSun, FaAngleDown
} from 'react-icons/fa';
import {
  RiDashboardFill,
  RiFileListFill,
  RiUser3Fill,
  RiChat3Fill,
  RiWallet3Fill
} from "react-icons/ri";
function DashboardLayout({ role = 'admin' }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isListingsOpen, setIsListingsOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-bs-theme', !isDarkMode ? 'dark' : 'light');
  };
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const adminMenu = [
    { path: '/dashboard/admin', label: 'Dashboard', icon: <RiDashboardFill /> },
    { path: '/dashboard/admin/users', label: 'Manage Users', icon: <FaUsers /> },
    { path: '/dashboard/admin/bookings', label: 'Manage Bookings', icon: <FaFileAlt /> },

    { 
      path: '/dashboard/admin/listings', 
      label: 'Listings', 
      icon: <FaHotel />,
      subMenu: [
        { path: '/dashboard/admin/destinations', label: 'Destinations' },
        { path: '/dashboard/admin/hotels', label: 'Hotels' },
        { path: '/dashboard/admin/tour-packages', label: 'Tour Packages' },
        { path: '/dashboard/admin/transports', label: 'Transports' },

      ]
    },
    { path: '/dashboard/admin/reports', label: 'Reports', icon: <FaFileAlt /> },
    { path: '/dashboard/admin/analytics', label: 'Analytics', icon: <FaChartPie /> },
    { path: '/dashboard/admin/settings', label: 'Settings', icon: <FaCog /> },

  ];

  const menu = role === 'admin' ? adminMenu : [];

  const customerMenu = [
 { path: '/dashboard/customer', label: 'Dashboard', icon: <RiDashboardFill /> },


     { 
      path: '/dashboard/customer/bookings', 
      label: 'My Bookings', 
      icon: <RiFileListFill />,
      subMenu: [
        { path: '/dashboard/customer/destinations', label: 'Saved Destinations' },
        { path: '/dashboard/customer/hotels', label: 'Hotel Bookings' },
        { path: '/dashboard/customer/tour-packages', label: 'Tour Packages Bookings' },
        { path: '/dashboard/customer/transports', label: 'Transport Bookings' },

      ]
    },
  { path: '/dashboard/customer/bookings', label: 'My Bookings', icon: <RiFileListFill /> },

  { path: '/dashboard/customer/payments', label: 'Payment History', icon: <RiWallet3Fill /> },

  { path: '/dashboard/customer/profile', label: 'Profile', icon: <RiUser3Fill /> },

  { path: '/dashboard/customer/support', label: 'Support', icon: <RiChat3Fill /> },
  ];

  if (role === 'customer') {
    menu.length = 0; // Clear existing menu
    customerMenu.forEach(item => menu.push(item)); // Add customer menu items
  }
  return (
    <div className={`dashboard d-flex position-relative ${isDarkMode ? 'dark-mode' : ''}`} style={{ border: '4px solid #0d6efd' }}>
      <aside className={`dashboard-sidebar bg-primary text-white p-3 ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4 className="m-0 d-flex align-items-center">
            {!isSidebarCollapsed && <><FaGlobe className="me-2" /> Ceylon Travels</>}
          </h4>
          <hr></hr>
          <hr></hr>
          <hr></hr>
          <button 
            className="btn btn-sm btn-outline-light rounded-circle p-1"
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        <ul className="nav flex-column">
          {menu.map((item) => (
            <li className="nav-item mb-1" key={item.path}>
              {item.subMenu ? (
                <>
                  <div 
                    className={`nav-link d-flex align-items-center justify-content-between py-3 px-3 text-white hover-light`}
                    onClick={() => setIsListingsOpen(!isListingsOpen)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <span className={`icon-wrapper ${isSidebarCollapsed ? 'mx-auto' : 'me-3'}`}>
                        {item.icon}
                      </span>
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isSidebarCollapsed && <FaAngleDown className={`ms-2 ${isListingsOpen ? 'rotate-180' : ''}`} />}
                  </div>

                  {isListingsOpen && !isSidebarCollapsed && (
                    <ul className="nav flex-column ms-4">
                      {item.subMenu.map((sub) => (
                        <li key={sub.path} className="nav-item mb-1">
                          <Link
                            to={sub.path}
                            className={`nav-link py-2 px-3 text-white hover-light ${location.pathname === sub.path ? 'bg-white text-primary rounded' : ''}`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center py-3 px-3 text-white ${
                    location.pathname === item.path ? 'active bg-white text-primary rounded' : 'hover-light'
                  }`}
                >
                  <span className={`icon-wrapper ${isSidebarCollapsed ? 'mx-auto' : 'me-3'}`}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <br />
           <br />
              <br />
<hr />
        {!isSidebarCollapsed && (
          <div className="sidebar-footer mt-auto">
            <button className="btn btn-outline-light btn-sm w-100 mb-2" onClick={toggleDarkMode}>
              {isDarkMode ? <FaSun className="me-2" /> : <FaMoon className="me-2" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="btn btn-light text-primary w-100 d-flex align-items-center justify-content-center" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </div>
        )}
      </aside>

      <main className="dashboard-main flex-grow-1 p-4">
        <hr></hr>
        <Outlet />
      </main>

      <style jsx>{`
        .dashboard { min-height: 100vh; display: flex; box-sizing: border-box; }
        .dashboard-sidebar { width: 280px; min-height: 100vh; transition: width 0.3s; }
        .dashboard-sidebar.collapsed { width: 80px; }
        .icon-wrapper { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; }
        .nav-link { transition: all 0.2s ease; text-decoration: none; }
        .hover-light:hover { background-color: rgba(255,255,255,0.1); border-radius: 0.25rem; }
        .nav-link.active { box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .sidebar-footer { margin-top: auto; }
        .rotate-180 { transform: rotate(180deg); transition: transform 0.3s; }
      `}</style>
    </div>
  );
}

export default DashboardLayout;
