// src/pages/public/AboutPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaUsers, FaHandshake, FaHeart, FaGlobe, FaLeaf, FaStar,
  FaHotel, FaMountain, FaCarSide, FaGlobeAfrica
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation components
const FadeInWhenVisible = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.6, delay }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  );
};

const StaggerChildren = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15 }}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children }) => {
  return (
    <motion.div
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 30 }
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Kavindi Nadeesha",
      role: "Founder & CEO",
      image: "https://t3.ftcdn.net/jpg/05/82/07/88/360_F_582078881_5tEPAOwIJvE7BDdeh5BlmO9VLg8bIWlf.jpg",
      bio: "With 15+ years in tourism, Kavindi is passionate about sharing Sri Lanka’s beauty with the world."
    },
    {
      id: 2,
      name: "Chamari Silva",
      role: "Head of Operations",
      image: "https://img.freepik.com/premium-photo/woman-tablet-web-office-portrait-public-relations-employee-monitor-news-trends-online-female-person-chat-market-research-social-media-networking-client-email-press-release_590464-446259.jpg",
      bio: "Chamari ensures every aspect of your journey is perfectly coordinated for a seamless experience."
    },
    {
      id: 3,
      name: "Dinesh Fernando",
      role: "Lead Tour Guide",
      image: "https://static.vecteezy.com/system/resources/thumbnails/037/098/807/small/ai-generated-a-happy-smiling-professional-man-light-blurry-office-background-closeup-view-photo.jpg",
      bio: "Dinesh's extensive knowledge of Sri Lankan history and culture brings every site to life for our guests."
    },
    {
      id: 4,
      name: "Priya Bandara",
      role: "Customer Experience Manager",
      image: "https://media.istockphoto.com/id/1386217759/photo/portrait-of-a-confident-young-businesswoman-standing-against-an-urban-background.jpg?s=612x612&w=0&k=20&c=fAzBj4UAksz3wwAjXxKxByZMqDSuqQZSTij7jBiPtJc=",
      bio: "Priya goes above and beyond to ensure every traveler's needs are met with personalized attention."
    }
  ];

  // Values data
  const values = [
    {
      icon: <FaHeart className="value-icon-svg" />,
      title: "Passion for Travel",
      description: "We genuinely love exploring Sri Lanka and sharing its wonders with others."
    },
    {
      icon: <FaHandshake className="value-icon-svg" />,
      title: "Integrity",
      description: "We operate with honesty and transparency in all our dealings."
    },
    {
      icon: <FaLeaf className="value-icon-svg" />,
      title: "Sustainable Tourism",
      description: "We're committed to preserving Sri Lanka's natural and cultural heritage."
    },
    {
      icon: <FaUsers className="value-icon-svg" />,
      title: "Community Focus",
      description: "We support local communities and businesses throughout our operations."
    },
    {
      icon: <FaStar className="value-icon-svg" />,
      title: "Excellence",
      description: "We strive to exceed expectations in every aspect of our service."
    },
    {
      icon: <FaGlobe className="value-icon-svg" />,
      title: "Global Perspective",
      description: "We blend local expertise with international standards of service."
    }
  ];

  return (
    <div className="about-page">
      {/* 🌄 Hero Intro Section with Parallax Effect */}
      <section className="hero-section text-white text-center d-flex align-items-center justify-content-center position-relative overflow-hidden">
        <div 
          className="hero-bg position-absolute w-100 h-100"
          style={{
            backgroundImage: `url('https://media.cntraveler.com/photos/64df56c0f3e99758036e9581/16:9/w_2560%2Cc_limit/1288609237')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        ></div>
        <div className="bg-overlay position-absolute w-100 h-100"></div>
        <motion.div 
          className="hero-content position-relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="display-4 fw-bold mb-3">About Ceylon Travels</h1>
          <p className="lead mb-4">Crafting unforgettable journeys across Sri Lanka </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="scroll-indicator">
              <span></span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="intro-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <FadeInWhenVisible>
                <h2 className="mb-4 section-title display-5 fw-bold">Welcome to Ceylon Travels</h2>
                <p className="lead text-muted mb-4">
                  Founded in 2025, we began as a small team of passionate travelers with a simple mission: to share the authentic beauty of Sri Lanka with the world.
                </p>
                <p className="mb-4">
                  At Ceylon Travels, we take pride in our deep local expertise, strong commitment to sustainable tourism, and dedication to fostering meaningful connections between travelers and the rich heritage of Sri Lanka. 
                  Every itinerary we design is crafted with care to highlight the island’s breathtaking diversity — from golden beaches and ancient kingdoms to mist-covered mountains and vibrant wildlife.                </p>
                <p className="mb-4">
                  Our team of local experts carefully designs each itinerary to showcase the diversity of our island nation - from pristine beaches and ancient cities to misty mountains and vibrant wildlife.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/tours" className="btn btn-primary rounded-pill px-4 py-2">
                      Explore Tours
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/contact" className="btn btn-outline-primary rounded-pill px-4 py-2">
                      Contact Us
                    </Link>
                  </motion.div>
                </div>
              </FadeInWhenVisible>
            </div>
            <div className="col-lg-6">
              <StaggerChildren className="row g-3">
                <div className="col-6">
                  <StaggerItem>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <img 
                        src="https://media.licdn.com/dms/image/v2/D4E12AQGYAOFyBioZuQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1712155895976?e=2147483647&v=beta&t=7HQA2KDNzWg5u9NPuUX35hL-k2dRYYlzEI6i6QEeQuA" 
                        alt="Sri Lanka Culture" 
                        className="img-fluid rounded-3 shadow-sm" 
                      />
                    </motion.div>
                  </StaggerItem>
                </div>
                <div className="col-6">
                  <StaggerItem>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <img 
                        src="https://media.houseandgarden.co.uk/photos/61894ecfa4c7bfe01adff93c/16:9/w_1280,c_limit/maskeliya-valley-house-14jan15_pr_b.jpg" 
                        alt="Sri Lanka Nature" 
                        className="img-fluid rounded-3 shadow-sm mt-5" 
                      />
                    </motion.div>
                  </StaggerItem>
                </div>
                <div className="col-6">
                  <StaggerItem>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <img 
                        src="https://blog.bhlankatours.com/wp-content/uploads/2024/09/Best-Wildlife-Safaris-of-Sri-Lanka-1000x600.jpg" 
                        alt="Sri Lanka Wildlife" 
                        className="img-fluid rounded-3 shadow-sm" 
                      />
                    </motion.div>
                  </StaggerItem>
                </div>
                <div className="col-6">
                  <StaggerItem>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <img 
                        src="https://www.stokedtotravel.com/wp-content/uploads/2019/05/IMG_5182.jpg" 
                        alt="Sri Lanka Beach" 
                        className="img-fluid rounded-3 shadow-sm mt-5" 
                      />
                    </motion.div>
                  </StaggerItem>
                </div>
              </StaggerChildren>
            </div>
          </div>
        </div>
      </section>

{/* 🧭 Mission & Vision */}
<section className="container py-5">
  <div className="row align-items-center mb-5">
    <div className="col-12 text-center">
      <FadeInWhenVisible>
        <h2 className="display-5 fw-bold mb-3">Our Mission & Vision</h2>
        <p className="lead text-muted">Guiding principles that define our purpose and aspirations</p>
      </FadeInWhenVisible>
    </div>
  </div>
  
  <div className="row align-items-stretch">
    <div className="col-md-6 mb-4">
      <StaggerItem>
        <motion.div 
          className="card border-1 shadow h-100 mission-card overflow-hidden"
          whileHover={{ y: -10, transition: { duration: 0.2 } }}
        >
          <div className="position-relative">
            <img 
              src="https://img.freepik.com/premium-photo/businessman-clicks-virtual-screen-mission_161452-13230.jpg" 
              alt="Sri Lanka travel experience" 
              className="card-img-top"
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <div className="icon-wrapper bg-primary bg-opacity-90 rounded-circle d-inline-flex align-items-center justify-content-center p-3 position-absolute top-100 start-50 translate-middle">
              <FaGlobe className="text-white" size={24} />
            </div>
          </div>
          <div className="card-body p-4 pt-5 text-center">
            <h4 className="fw-bold mb-3">Our Mission</h4>
            <p className="mb-0">
               To simplify travel in Sri Lanka by connecting visitors with authentic experiences, 
            from luxury stays to cultural adventures making every journey effortless and memorable.
            Whether it's a family holiday, a solo adventure, or a romantic getaway, 
              we are committed to delivering personalized, trustworthy, and unforgettable travel experiences.
            </p>
          </div>
        </motion.div>
      </StaggerItem>
    </div>
    
    <div className="col-md-6 mb-4">
      <StaggerItem>
        <motion.div 
          className="card border-1 shadow h-100 vision-card overflow-hidden"
          whileHover={{ y: -10, transition: { duration: 0.2 } }}
        >
          <div className="position-relative">
            <img 
              src="https://jasfoundation.org.in/wp-content/uploads/2023/10/vision-jas-scaled.jpg" 
              alt="Future of Sri Lanka tourism" 
              className="card-img-top"
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <div className="icon-wrapper bg-primary bg-opacity-90 rounded-circle d-inline-flex align-items-center justify-content-center p-3 position-absolute top-100 start-50 translate-middle">
              <FaStar className="text-white" size={24} />
            </div>
          </div>
          <div className="card-body p-4 pt-5 text-center">
            <h4 className="fw-bold mb-3">Our Vision</h4>
            <p className="mb-0">
               To be Sri Lanka’s leading travel platform blending technology with culture, 
              empowering communities, and creating sustainable, world-class travel experiences.
             Sri Lanka as a world-class destination while empowering local communities, preserving natural treasures, 
              and creating unforgettable travel stories for generations to come.
            </p>
          </div>
        </motion.div>
      </StaggerItem>
    </div>
  </div>
</section>

      {/* Values Section */}
      <section className="values-section py-5">
        <div className="container">
          <FadeInWhenVisible>
            <h2 className="text-center mb-5 section-title display-5 fw-bold">Our Values</h2>
          </FadeInWhenVisible>
          <StaggerChildren className="row g-4">
            {values.map((value, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <StaggerItem>
                  <motion.div 
                    className="value-card card border-1 shadow-sm h-100 rounded-4"
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="card-body text-center p-4">
                      <motion.div 
                        className="value-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {value.icon}
                      </motion.div>
                      <h5 className="card-title fw-bold">{value.title}</h5>
                      <p className="card-text text-muted">{value.description}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>
{/* Team Section - Minimalist */}
      <section className="team-section py-5 bg-light">
        <div className="container">
          <FadeInWhenVisible>
            <h2 className="text-center mb-3 section-title display-5 fw-bold">Meet Our Team</h2>
            <p className="text-center text-muted lead mb-5">Our passionate team of travel experts is dedicated to creating your perfect Sri Lankan adventure</p>
          </FadeInWhenVisible>
          
          <StaggerChildren className="row g-4">
            {teamMembers.map((member) => (
              <div className="col-md-6 col-lg-3" key={member.id}>
                <StaggerItem>
                  <motion.div 
                    className="team-card card border-1 shadow-sm h-100 rounded-4 overflow-hidden"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="position-relative">
                      <motion.img 
                        src={member.image} 
                        className="card-img-top" 
                        alt={member.name}
                        style={{height: '220px', objectFit: 'cover'}}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Name badge overlay */}
                      <div className="position-absolute bottom-0 start-0 w-100 p-3">
                        <div className="bg-dark bg-opacity-75 rounded-3 p-3 text-center">
                          <h6 className="mb-0 text-white fw-bold">{member.name}</h6>
                          <small className="text-light opacity-80">{member.role}</small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body p-3">
                      <p className="card-text small text-muted mb-0">{member.bio}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* 💼 What We Offer */}
      <section className="py-5 bg-light">
        <div className="container">
          <FadeInWhenVisible>
            <h2 className="text-center fw-bold mb-5 display-5">What We Offer</h2>
          </FadeInWhenVisible>
          <StaggerChildren className="row g-4">
            <div className="col-md-6 col-lg-3">
              <StaggerItem>
                <motion.div 
                  className="service-card p-4 shadow-sm border rounded-4 h-100 text-center"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                >
                  <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3">
                    <FaHotel className="text-primary" size={24} />
                  </div>
                  <h5 className="fw-bold">Hotels & Stays</h5>
                  <p className="text-muted">Hundreds of verified hotels, homestays & resorts for every budget.</p>
                </motion.div>
              </StaggerItem>
            </div>
            <div className="col-md-6 col-lg-3">
              <StaggerItem>
                <motion.div 
                  className="service-card p-4 shadow-sm border rounded-4 h-100 text-center"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                >
                  <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3">
                    <FaMountain className="text-success" size={24} />
                  </div>
                  <h5 className="fw-bold">Tours & Experiences</h5>
                  <p className="text-muted">Cultural, nature, wildlife and off-grid tours from trusted providers.</p>
                </motion.div>
              </StaggerItem>
            </div>
            <div className="col-md-6 col-lg-3">
              <StaggerItem>
                <motion.div 
                  className="service-card p-4 shadow-sm border rounded-4 h-100 text-center"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                >
                  <div className="icon-wrapper bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3">
                    <FaCarSide className="text-warning" size={24} />
                  </div>
                  <h5 className="fw-bold">Transport Solutions</h5>
                  <p className="text-muted">Airport pickups, taxi rentals, vans for groups, adventures & more.</p>
                </motion.div>
              </StaggerItem>
            </div>
            <div className="col-md-6 col-lg-3">
              <StaggerItem>
                <motion.div 
                  className="service-card p-4 shadow-sm border rounded-4 h-100 text-center"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                >
                  <div className="icon-wrapper bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3">
                    <FaGlobeAfrica className="text-danger" size={24} />
                  </div>
                  <h5 className="fw-bold">Multi-Language Support</h5>
                  <p className="text-muted">Available in English and expanding for global reach!</p>
                </motion.div>
              </StaggerItem>
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container">
          <FadeInWhenVisible>
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="mb-4 display-6 fw-bold">Ready to Explore Sri Lanka?</h2>
                <p className="lead mb-4">Join thousands of travelers who have experienced the magic of Sri Lanka with us</p>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/tours" className="btn btn-light btn-lg rounded-pill px-4 py-2">
                      Browse Tours
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/contact" className="btn btn-outline-light btn-lg rounded-pill px-4 py-2">
                      Get in Touch
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Custom Styles */}
      <style>{`
        .about-page {
          font-family: 'Inter', sans-serif;
        }
        
        .hero-section {
          height: 100vh;
          min-height: 600px;
          position: relative;
        }
        
        .hero-bg {
          transform: scale(1.1);
          transition: transform 10s ease-out;
        }
        
        .hero-section:hover .hero-bg {
          transform: scale(1);
        }
        
        .bg-overlay {
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
        }
        
        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .scroll-indicator span {
          display: block;
          width: 30px;
          height: 30px;
          border-bottom: 2px solid #fff;
          border-right: 2px solid #fff;
          transform: rotate(45deg);
          animation: scrollAnimation 2s infinite;
        }
        
        @keyframes scrollAnimation {
          0% {
            opacity: 0;
            transform: rotate(45deg) translate(-10px, -10px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: rotate(45deg) translate(10px, 10px);
          }
        }
        
        .section-title {
          position: relative;
          display: inline-block;
        }
        
        .section-title:after {
          content: '';
          position: absolute;
          width: 60px;
          height: 3px;
          background: linear-gradient(to right, #0d6efd, #20c997);
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .value-icon-svg {
          font-size: 1.5rem;
          color: #0d6efd;
        }
        
        .team-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .team-card:hover .team-overlay {
          opacity: 1;
        }
        
        .stats-section {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
        }
        
        .mission-card, .vision-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .service-card {
          transition: all 0.3s ease;
        }
        
        .value-card {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default AboutPage;