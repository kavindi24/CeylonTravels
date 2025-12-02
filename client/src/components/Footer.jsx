import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import TravelLogo from '../assets/FooterLogo.png';

function Footer() {
  return (
    <footer className="bg-primary-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4 mb-4">
            <div className="footer-logo-section">
              <Link to="/" className="footer-logo mb-3 d-inline-block">
                <img src={TravelLogo} alt="CeylonTravels Logo" className="footer-logo-image" />
              </Link>
              <p className="mb-4">Discover the beauty of Sri Lanka with our premium travel services. Experience luxury, comfort, and unforgettable memories.</p>
              <div className="d-flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaFacebookF /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaTwitter /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">QUICK LINKS</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="footer-link">Home</Link></li>
              <li className="mb-2"><Link to="/destinations" className="footer-link">Destinations</Link></li>
              <li className="mb-2"><Link to="/tours" className="footer-link">Tours</Link></li>
              <li className="mb-2"><Link to="/hotels" className="footer-link">Hotels</Link></li>
              <li className="mb-2"><Link to="/transport" className="footer-link">Transport</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">SUPPORT</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li className="mb-2"><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li className="mb-2"><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li className="mb-2"><Link to="/booking-policy" className="footer-link">Booking Policy</Link></li>
            </ul>
          </div>
          
          {/* Contact Info & Newsletter */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-3">CONTACT INFO</h6>
            <div className="d-flex align-items-center mb-3">
              <div className="icon-container me-3"><FaMapMarkerAlt /></div>
              <span>123 Galle Road, Colombo, Sri Lanka</span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <div className="icon-container me-3"><FaPhone /></div>
              <span>+94 11 234 5678</span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <div className="icon-container me-3"><FaEnvelope /></div>
              <span>info@ceylontravels.com</span>
            </div>
            
            <div className="mt-4">
              <h6 className="fw-bold mb-3">NEWSLETTER</h6>
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Your email address" 
                  aria-label="Your email address"
                />
                <button className="btn btn-light" type="button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">Copyright &copy; 2025 Ceylon Travels. All rights reserved.</p>
            
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/terms" className="text-decoration-none text-light mx-2">Terms</Link>
            <span className="text-light">|</span>
            <Link to="/privacy" className="text-decoration-none text-light mx-2">Privacy</Link>
            <span className="text-light">|</span>
            <Link to="/privacy" className="text-decoration-none text-light mx-2">developed by Kavindi</Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .bg-primary-dark {
          background: linear-gradient(135deg, #0a2463 0%, #1e40af 100%);
        }

        .footer-logo-image {
          height: 30px;
          width: auto;
        }

        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: white;
          padding-left: 5px;
        }

        .icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          color: #93c5fd;
        }

        .form-control {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-control:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.1);
          color: white;
        }

        hr {
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </footer>
  );
}

export default Footer;
