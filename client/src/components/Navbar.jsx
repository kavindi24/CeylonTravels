import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle, FaBars, FaTimes, FaBell, FaGlobe } from "react-icons/fa";
import TravelLogo from "../assets/TravelLogo.png";

function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // ✅ Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  // Language state
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("preferredLanguage") || "en"
  );

  // Translations
  const translations = {
    en: {
      home: "Home",
      listings: "Listings",
      hotels: "Hotels",
      tours: "Tours",
      transport: "Transport",
      destinations: "Destinations",
      about: "About",
      contact: "Contact",
      blog: "Blog",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
      register: "Register",
      notifications: "Notifications"
    },
    si: {
      home: "මුල් පිටුව",
      listings: "ලැයිස්තු",
      hotels: "හෝටල්",
      tours: "සංචාර",
      transport: "ප්‍රවාහන",
      destinations: "ගමනාන්ත",
      about: "අප ගැන",
      contact: "සම්බන්ධ කරගන්න",
      blog: "බ්ලොග්",
      dashboard: "උපකරණ පුවරුව",
      profile: "පැතිකඩ",
      settings: "සැකසුම්",
      logout: "නික්මෙන්න",
      login: "පිවිසෙන්න",
      register: "ලියාපදිංචි වන්න",
      notifications: "දැනුම්දීම්"
    },
    ta: {
      home: "முகப்பு",
      listings: "பட்டியல்கள்",
      hotels: "ஹோட்டல்கள்",
      tours: "சுற்றுப்பயணங்கள்",
      transport: "போக்குவரத்து",
      destinations: "சேரிடங்கள்",
      about: "எங்களைப் பற்றி",
      contact: "தொடர்பு கொள்ள",
      blog: "வலைப்பதிவு",
      dashboard: "டாஷ்போர்டு",
      profile: "சுயவிவரம்",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",
      login: "உள்நுழைய",
      register: "பதிவு செய்ய",
      notifications: "அறிவிப்புகள்"
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      const role = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    checkAuth();

    // Listen to storage changes (for multi-tab support)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    setIsProfileDropdownOpen(false);
    closeMobileMenu();
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    setIsLanguageDropdownOpen(false);
  };

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem("preferredLanguage", langCode);
    setIsLanguageDropdownOpen(false);
    closeMobileMenu();
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <nav className={`navbar navbar-expand-lg sticky-top ${isScrolled ? "bg-glass shadow-sm" : "bg-transparent"}`}>
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={TravelLogo} alt="CeylonTravels Logo" className="logo-img" />
        </Link>

        {/* Mobile toggle */}
        <button 
          className="navbar-toggler custom-toggler" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Nav links */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" onClick={closeMobileMenu}>
                {t("home")}
                <span className="nav-link-underline"></span>
              </NavLink>
            </li>

            {/* Listings dropdown */}
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle btn btn-link" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
              >
                {t("listings")}
                <span className="nav-link-underline"></span>
              </button>
              {isDropdownOpen && (
                <ul className="dropdown-menu show">
                  <li>
                    <Link to="/listings/hotels" className="dropdown-item" onClick={closeMobileMenu}>
                      {t("hotels")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/listings/tours" className="dropdown-item" onClick={closeMobileMenu}>
                      {t("tours")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/listings/transport" className="dropdown-item" onClick={closeMobileMenu}>
                      {t("transport")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/listings/destinations" className="dropdown-item" onClick={closeMobileMenu}>
                      {t("destinations")}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <NavLink to="/about" className="nav-link" onClick={closeMobileMenu}>
                {t("about")}
                <span className="nav-link-underline"></span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link" onClick={closeMobileMenu}>
                {t("contact")}
                <span className="nav-link-underline"></span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/blog" className="nav-link" onClick={closeMobileMenu}>
                {t("blog")}
                <span className="nav-link-underline"></span>
              </NavLink>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink 
                    to={userRole === "admin" ? "/dashboard/admin" : "/dashboard/customer"} 
                    className="nav-link" 
                    onClick={closeMobileMenu}
                  >
                    {t("dashboard")}
                    <span className="nav-link-underline"></span>
                  </NavLink>
                </li>

                <li className="nav-item dropdown ms-lg-2">
                  <button 
                    className="nav-link profile-btn" 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    aria-expanded={isProfileDropdownOpen}
                  >
                    <FaUserCircle className="profile-icon" />
                  </button>
                  {isProfileDropdownOpen && (
                    <ul className="dropdown-menu show profile-dropdown">
                      <li>
                        <Link to="/dashboard/customer/profile" className="dropdown-item" onClick={closeMobileMenu}>
                          {t("profile")}
                        </Link>
                      </li>
                     
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          {t("logout")}
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
                
                <li className="nav-item ms-lg-2 position-relative">
                  <button
                    className="nav-link notification-btn"
                    onClick={() => alert("Notifications clicked!")}
                    aria-label={t("notifications")}
                  >
                    <FaBell />
                    <span className="notification-badge">3</span>
                  </button>
                </li>
                            {/* Language Selector */}
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle btn btn-link language-btn" 
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                aria-expanded={isLanguageDropdownOpen}
              >
                <FaGlobe className="globe-icon" />
              </button>
              {isLanguageDropdownOpen && (
                <ul className="dropdown-menu show">
                  <li>
                    <button 
                      className={`dropdown-item ${currentLanguage === 'en' ? 'active-language' : ''}`}
                      onClick={() => changeLanguage('en')}
                    >
                      English
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item ${currentLanguage === 'si' ? 'active-language' : ''}`}
                      onClick={() => changeLanguage('si')}
                    >
                      සිංහල
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item ${currentLanguage === 'ta' ? 'active-language' : ''}`}
                      onClick={() => changeLanguage('ta')}
                    >
                      தமிழ்
                    </button>
                  </li>
                </ul>
              )}
            </li>

              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link" onClick={closeMobileMenu}>
                    {t("login")}
                    <span className="nav-link-underline"></span>
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <NavLink to="/register" className="nav-link register-link" onClick={closeMobileMenu}>
                    {t("register")}
                  </NavLink>
                </li>
                
              </>
            )}
          </ul>
        </div>
      </div>
      
      {/* Styles */}
      <style jsx>{`
        .bg-glass {
          background: rgba(255, 255, 255, 0.9) !important;
          border-bottom: 1px solid rgba(44, 123, 229, 0.1);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .logo-img {
          height: 30px;
          width: auto;
        }

        @media (max-width: 768px) {
          .logo-img {
            height: 30px;
          }
        }

        .custom-toggler {
          border: none;
          background: transparent;
          font-size: 1.5rem;
          color: #2c7be5;
          padding: 0.25rem 0.5rem;
        }

        .nav-link {
          font-weight: 500;
          color: #2d3748 !important;
          margin: 0 0.5rem;
          padding: 0.3rem 0.4rem !important;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #2c7be5 !important;
          transform: translateY(-2px);
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

        .dropdown-menu {
          border: none;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          margin-top: 0.8rem;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(44, 123, 229, 0.1);
        }

        .dropdown-item {
          border-radius: 8px;
          padding: 0.7rem 1rem;
          transition: all 0.2s ease;
          color: #4a5568;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .dropdown-item:hover {
          background: linear-gradient(135deg, #2c7be5, #0a58ca);
          color: white;
          transform: translateX(5px);
        }
        
        .active-language {
          background-color: #f0f7ff;
          color: #2c7be5;
          font-weight: 600;
        }

        .register-link {
          background: linear-gradient(135deg, #2c7be5, #0a58ca);
          border-radius: 12px;
          color: white !important;
          margin-left: 0.5rem;
          padding: 0.5rem 1.2rem !important;
          transition: all 0.3s ease;
        }

        .register-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(44, 123, 229, 0.4);
          color: white !important;
        }

        /* Language button styles */
        .language-btn {
          background: transparent;
          border: none;
          padding: 0;
          color: #2c7be5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .language-btn:hover {
          color: #0a58ca;
          transform: scale(1.1);
        }

        .globe-icon {
          font-size: 1.3rem; /* Adjusted globe icon size */
        }

        /* Profile button styles */
        .profile-btn {
          background: transparent;
          border: none;
          padding: 0;
          color: #2c7be5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .profile-btn:hover {
          color: #0a58ca;
          transform: scale(1.1);
        }

        .profile-icon {
          font-size: 1.6rem; /* Set profile icon size */
        }

        .notification-btn {
          background: transparent;
          border: none;
          padding: 0;
          color: #2c7be5;
          font-size: 1.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .notification-btn:hover {
          color: #0a58ca;
          transform: scale(1.1);
        }
        
        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #e53e3e;
          color: white;
          font-size: 0.6rem;
          font-weight: bold;
          padding: 2px 5px;
          border-radius: 50%;
          border: 1px solid white;
        }

        .profile-dropdown {
          position: absolute;
          right: 0;
          left: auto;
          min-width: 180px;
        }

        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 1rem;
            border-radius: 12px;
            margin-top: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(44, 123, 229, 0.1);
            max-height: 80vh;
            overflow-y: auto;
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
            padding: 0.5rem 0 !important;
          }
          
          .dropdown-menu {
            position: static;
            float: none;
            width: 100%;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          .register-link {
            margin-left: 0;
            margin-top: 0.5rem;
            display: inline-block;
            text-align: center;
          }

          .profile-btn, .notification-btn, .language-btn {
            margin-top: 0.5rem;
            justify-content: flex-start;
            font-size: 1.2rem;
            padding: 0.5rem 0;
          }

          .profile-dropdown {
            position: static;
            width: 100%;
          }
          
          .navbar-toggler {
            order: 2;
          }
          
          .navbar-logo {
            order: 1;
          }
          
          .navbar-collapse {
            order: 3;
          }
        }
        
        @media (max-width: 576px) {
          .container {
            padding-left: 15px;
            padding-right: 15px;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;