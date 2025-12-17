import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaBars, FaTimes, FaBell, FaGlobe, FaChevronDown,FaSignOutAlt } from "react-icons/fa";
import TravelLogo from "../assets/TravelLogo.png";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

function Navbar() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const { t } = useTranslation();

  // Handle authentication state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      const role = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
      const savedLang = localStorage.getItem("preferredLanguage") || "en";
      
      setIsLoggedIn(!!token);
      setUserRole(role);
      setCurrentLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    };

    checkAuth();
    
    const handleStorage = () => {
      checkAuth();
    };
    
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when resizing to larger screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        closeMobileMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setIsProfileDropdownOpen(false);
    navigate("/");
  }, [navigate]);

  const closeAllDropdowns = useCallback(() => {
    setIsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    setIsLanguageDropdownOpen(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    closeAllDropdowns();
  }, [closeAllDropdowns]);

  const changeLanguage = useCallback((lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
    setCurrentLanguage(lang);
    setIsLanguageDropdownOpen(false);
    closeMobileMenu();
  }, [closeMobileMenu]);

  const toggleDropdown = useCallback((dropdownType) => {
    // Close all other dropdowns first
    closeAllDropdowns();
    
    switch (dropdownType) {
      case 'listings':
        setIsDropdownOpen(prev => !prev);
        break;
      case 'profile':
        setIsProfileDropdownOpen(prev => !prev);
        break;
      case 'language':
        setIsLanguageDropdownOpen(prev => !prev);
        break;
      default:
        break;
    }
  }, [closeAllDropdowns]);

  const dropdownItems = [
    { path: "/listings/hotels", label: t("hotels") },
    { path: "/listings/tours", label: t("tours") },
    { path: "/listings/transport", label: t("transport") },
    { path: "/listings/destinations", label: t("destinations") },
  ];

  const languageOptions = [
    { code: "en", label: "English", native: "English" },
    { code: "si", label: "සිංහල", native: "සිංහල" },
    { code: "ta", label: "தமிழ்", native: "தமிழ்" },
  ];

  return (
    <nav className="navbar navbar-expand-lg  bg-white shadow-sm fixed-top py-3">
      <div className="container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={TravelLogo} alt="CeylonTravels Logo" className="logo-img" />
        </Link>

        <button 
          className="navbar-toggler custom-toggler" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} 
                onClick={closeMobileMenu}
                end
              >
                {t("home")}
                <span className="nav-link-underline"></span>
              </NavLink>
            </li>

            <li className="nav-item dropdown" ref={dropdownRef}>
              <button 
                className="nav-link dropdown-toggle btn btn-link d-flex align-items-center gap-1"
                onClick={() => toggleDropdown('listings')}
                aria-expanded={isDropdownOpen}
              >
                {t("listings")}
                <FaChevronDown className={`dropdown-chevron ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                {dropdownItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className="dropdown-item" 
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {["about", "contact", "blog"].map((item) => (
              <li className="nav-item" key={item}>
                <NavLink 
                  to={`/${item}`} 
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  {t(item)}
                </NavLink>
              </li>
            ))}

            {/* Logged In */}
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to={userRole === "admin" ? "/dashboard/admin" : "/dashboard/customer"}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    onClick={closeMobileMenu}
                  >
                    {t("dashboard")}
                  </NavLink>
                </li>

                <li className="nav-item ms-lg-2">
                  <button 
                    className="nav-link notification-btn position-relative"
                    onClick={() => {
                      navigate("/notifications");
                      closeMobileMenu();
                    }}
                    aria-label="Notifications"
                  >
                    <FaBell />
                  </button>
                </li>

                {/* Logout Button (replacing Profile Dropdown) */}
                <li className="nav-item ms-lg-2">
                  <button
                    className="btn btn-outline-light d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-1" />
                    {t("logout")}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} 
                    onClick={closeMobileMenu}
                  >
                    {t("login")}
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <NavLink 
                    to="/register" 
                    className="nav-link register-link"
                    onClick={closeMobileMenu}
                  >
                    {t("register")}
                  </NavLink>
                </li>
              </>
            )}

            {/* Language Dropdown */}
            <li className="nav-item dropdown ms-lg-3" ref={languageDropdownRef}>
              <button
                className="nav-link language-btn d-flex align-items-center gap-2"
                onClick={() => toggleDropdown('language')}
                aria-expanded={isLanguageDropdownOpen}
              >
                <FaGlobe className="globe-icon" />
                <span className="language-code d-none d-lg-inline">
                  {currentLanguage.toUpperCase()}
                </span>
              </button>

              <ul className={`dropdown-menu ${isLanguageDropdownOpen ? "show" : ""}`}>
                {languageOptions.map((lang) => (
                  <li key={lang.code}>
                    <button 
                      className={`dropdown-item ${currentLanguage === lang.code ? "active-language" : ""}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <span className="d-flex justify-content-between align-items-center">
                        <span>{lang.label}</span>
                        {currentLanguage === lang.code && (
                          <span className="check-mark">✓</span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          padding: 0.75rem 0;
          background-color: white !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;

          z-index: 1050;
          transition: all 0.3s ease;
        }
        
        .logo-img {
          height: 40px;
          width: auto;
          transition: all 0.3s ease;
        }
        
        .logo-img:hover {
          transform: scale(1.05);
        }
        
        .custom-toggler {
          border: none;
          background: transparent;
          font-size: 1.5rem;
          color: #2c7be5;
          padding: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .custom-toggler:hover {
          transform: rotate(90deg);
          color: #0a58ca;
        }
        
        .nav-link {
          font-weight: 500;
          color: #4a5568 !important;
          margin: 0 0.5rem;
          padding: 0.5rem 0.75rem !important;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          color: #2c7be5 !important;
          transform: translateY(-2px);
        }
        
        .nav-link.active {
          color: #2c7be5 !important;
          font-weight: 600;
        }
        
        .nav-link-underline {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #2c7be5, #0a58ca);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }
        
        .nav-link:hover .nav-link-underline,
        .nav-link.active .nav-link-underline {
          width: 70%;
        }
        
        .dropdown-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
        }
        
        .dropdown-toggle:focus {
          outline: none;
          box-shadow: none;
        }
        
        .dropdown-chevron {
          font-size: 0.8rem;
          transition: transform 0.3s ease;
        }
        
        .rotate-180 {
          transform: rotate(180deg);
        }
        
        .dropdown-menu {
          border: none;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          padding: 0.5rem 0;
          margin-top: 0.8rem;
          background: white;
          border: 1px solid rgba(44, 123, 229, 0.1);
          animation: slideDown 0.2s ease;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dropdown-item {
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          transition: all 0.2s ease;
          color: #4a5568;
          font-weight: 500;
          margin: 0.2rem 0.5rem;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          width: calc(100% - 1rem);
        }
        
        .dropdown-item:hover {
          background: linear-gradient(135deg, #2c7be5, #0a58ca);
          color: white;
          transform: translateX(5px);
        }
        
        .active-language {
          background: linear-gradient(135deg, #2c7be5, #0a58ca) !important;
          color: white !important;
          font-weight: 600;
        }
        
        .check-mark {
          font-weight: bold;
        }
        
        .register-link {
          background: linear-gradient(135deg, #2c7be5, #0a58ca);
          border-radius: 12px;
          color: white !important;
          padding: 0.5rem 1.5rem !important;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        
        .register-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(44, 123, 229, 0.4);
          color: white !important;
        }
        
        .language-btn {
          background: transparent;
          border: none;
          color: #2c7be5;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 8px;
        }
        
        .language-btn:hover {
          background: rgba(44, 123, 229, 0.1);
          transform: scale(1.1);
        }
        
        .globe-icon {
          font-size: 1.3rem;
        }
        
        .language-code {
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        .profile-btn, .notification-btn {
          background: transparent;
          border: none;
          color: #2c7be5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          transition: all 0.3s ease;
          border-radius: 8px;
        }
        
        .profile-btn:hover, .notification-btn:hover {
          background: rgba(44, 123, 229, 0.1);
          transform: scale(1.1);
        }
        
        .profile-icon {
          font-size: 1.8rem;
        }
        
        .notification-btn {
          position: relative;
          font-size: 1.3rem;
        }
        
        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #e53e3e;
          color: white;
          font-size: 0.65rem;
          font-weight: bold;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .profile-dropdown {
          min-width: 180px;
          right: 0;
          left: auto !important;
        }
        
        .dropdown-divider {
          border-color: rgba(44, 123, 229, 0.1);
          margin: 0.5rem 0;
        }
        
        /* Add padding to body to account for fixed navbar */
        :global(body) {
          padding-top: 70px !important;
        }
        
        /* Mobile Styles */
        @media (max-width: 991.98px) {
          .navbar {
            padding: 0.5rem 0;
          }
          
          :global(body) {
            padding-top: 60px !important;
          }
          
          .navbar-collapse {
            background: white;
            padding: 1rem;
            border-radius: 12px;
            margin-top: 0.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(44, 123, 229, 0.1);
            max-height: calc(100vh - 80px);
            overflow-y: auto;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 1050;
          }
          
          .navbar-nav {
            align-items: flex-start;
          }
          
          .nav-item {
            width: 100%;
            margin-bottom: 0.5rem;
          }
          
          .nav-link {
            margin: 0;
            padding: 0.75rem 0 !important;
            justify-content: flex-start;
          }
          
          .dropdown-menu {
            position: static;
            float: none;
            width: 100%;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            box-shadow: none;
            border: 1px solid rgba(44, 123, 229, 0.1);
            background: rgba(255, 255, 255, 0.9);
          }
          
          .register-link {
            margin-left: 0;
            margin-top: 0.5rem;
            display: block;
            text-align: center;
            width: 100%;
          }
          
          .profile-btn, .notification-btn, .language-btn {
            margin-top: 0.5rem;
            justify-content: flex-start;
            padding: 0.75rem 0;
            width: 100%;
          }
          
          .profile-dropdown {
            position: static;
            width: 100%;
          }
          
          .language-code {
            display: inline-block !important;
          }
        }
        
        /* Tablet Styles */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .nav-link {
            padding: 0.5rem 0.5rem !important;
            font-size: 0.95rem;
          }
        }
        
        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .navbar {
            background-color: #1a1a1a !important;
            border-bottom: 1px solid #333;
          }
          
          .nav-link {
            color: #e0e0e0 !important;
          }
          
          .nav-link:hover,
          .nav-link.active {
            color: #60a5fa !important;
          }
          
          .dropdown-menu {
            background-color: #2d2d2d !important;
            border: 1px solid #444;
          }
          
          .dropdown-item {
            color: #e0e0e0;
          }
          
          .dropdown-item:hover {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
          }
          
          @media (max-width: 991.98px) {
            .navbar-collapse {
              background-color: #2d2d2d !important;
              border: 1px solid #444;
            }
            
            .dropdown-menu {
              background-color: #3d3d3d !important;
            }
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;