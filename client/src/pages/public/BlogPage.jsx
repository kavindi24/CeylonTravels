// src/pages/public/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt, FaSearch,  FaUser } from "react-icons/fa";

const mockBlogs = [
  {
    id: 1,
    title: "10 Hidden Travel Gems in Sri Lanka",
    excerpt: "Skip the tourist traps and explore ancient forts, secret waterfalls, and cultural villages.",
    image: "https://srilankatravelpages.com/my_content/uploads/2025/08/Sri-lanka-1024x614.jpg",
    author: "Chaminda Perera",
    date: "September 15, 2025",
    tags: ["Nature", "Hidden Gems"],
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Best Time to Visit Sri Lanka — Weather Breakdown ",
    excerpt: "From beaches to mountains, discover the ideal times to explore each region.",
    image: "https://hnj-website.s3.amazonaws.com/uploads/2022/08/sri-lanka-south-coast-near-weligama-min-e1663149110438-1024x279.jpg",
    author: "Ishara Fernando",
    date: "August 22, 2025",
    tags: ["Seasons", "Planning"],
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Sri Lankan Street Food Guide ",
    excerpt: "Try spicy kottu, hoppers, and hidden food spots only locals know!",
    image: "https://i.ytimg.com/vi/D18Tc3_TA24/sddefault.jpg",
    author: "Nirmala Jayasinghe",
    date: "July 5, 2025",
    tags: ["Food", "Culture"],
    readTime: "4 min read"
  },
  {
    id: 4,
    title: "Cultural Festivals in Sri Lanka ",
    excerpt: "Don't miss Vesak, Esala Perahera, and Poson Poya on your cultural journey.",
    image: "https://i.ytimg.com/vi/rXKtqkpqGjA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDSArXf-BLEfBAD2VdBE2or74h2kw",
    author: "Abdul Kareem",
    date: "June 10, 2025",
    tags: ["Culture", "Events"],
    readTime: "6 min read"
  },
  {
    id: 5,
    title: "Wildlife Safari in Yala National Park",
    excerpt: "Experience the thrill of spotting leopards, elephants, and exotic birds in their natural habitat.",
    image: "https://cdn.getyourguide.com/image/format=auto,fit=contain,gravity=auto,quality=60,width=1440,height=650,dpr=1/tour_img/a98a42a4ad6ecff56728039f5058c278f33b73930f1a9c5c5e70145c1d9ce50a.jpg",
    author: "Rajitha Silva",
    date: "May 18, 2025",
    tags: ["Nature", "Wildlife"],
    readTime: "8 min read"
  },
  {
    id: 6,
    title: "Ayurvedic Wellness Retreats in Sri Lanka ",
    excerpt: "Rejuvenate your mind, body, and soul with traditional Ayurvedic treatments.",
    image: "https://img.fitreisen.group/eyJidWNrZXQiOiJmaXRyZWlzZW4tY2RuLWltYWdlcyIsImtleSI6IkNBRTlCRTczNEM3NzI1QTVDRjQ4RDNCM0E4NDA2RDk1IiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoxMjgwLCJoZWlnaHQiOjQ5MiwiZml0IjoiY292ZXIiLCJwb3NpdGlvbiI6ImNlbnRlciJ9fX0=?signature=6439842348f12a69082cee1d130fa0dda935f15220efae2573158ea738279246",
    author: "Samanthi Perera",
    date: "April 3, 2025",
    tags: ["Wellness", "Culture"],
    readTime: "5 min read"
  }
];

// Extract all unique tags from mockBlogs
const allTags = ['All', ...new Set(mockBlogs.flatMap(blog => blog.tags))];

function BlogPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation on component mount
    setIsVisible(true);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const filteredBlogs = mockBlogs.filter(
    (blog) =>
      (selectedTag === 'All' || blog.tags.includes(selectedTag)) &&
      blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  return (
    <div className={`blog-page ${isVisible ? '' : ''}`}>
      {/* 🎯 Hero Header */}
      <header className="blog-hero d-flex align-items-center justify-content-center text-white text-center">
        <div className="container position-relative z-2">
          <h1 className="display-5 fw-bold slide-in-top">Ceylon Travels Blog</h1>
          <p className="lead slide-in-bottom">Travel insights, tips, and stories from Sri Lanka's #1 travel platform</p>
          <div className="mt-4 slide-in-bottom">
            <div className="btn-group">
              <button className="btn btn-primary rounded-pill px-4">Latest Posts</button>
              <button className="btn btn-outline-light rounded-pill px-4 ms-2">Trending</button>
            </div>
          </div>
        </div>
        <div className="overlay"></div>
      </header>

      {/* 🔍 Search and Filter Section */}
      <section className="search-section py-4 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="input-group rounded-pill shadow-sm">
                <span className="input-group-text bg-transparent border-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent"
                  placeholder="Search blog posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="row mt-4">
            <div className="col-12">
              <div className="d-flex flex-wrap justify-content-center">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`btn rounded-pill mx-1 my-1 ${selectedTag === tag ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📚 Main Blog Posts Grid */}
      <section className="main-blog-posts py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold section-title">Explore Our Blog</h2>
          <div className="row g-4">
            {filteredBlogs.map((blog, index) => (
              <div 
                className="col-md-6 col-lg-4" 
                key={blog.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="blog-card card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                  <div className="image-container overflow-hidden">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="card-img-top hover-zoom" 
                      style={{ height: "200px", objectFit: "cover" }} 
                    />
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary">{blog.tags[0]}</span>
                      <small className="text-muted">{blog.readTime}</small>
                    </div>
                    <h5 className="card-title">{blog.title}</h5>
                    <p className="card-text">{blog.excerpt}</p>
                  </div>
                  <div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <FaUser className="text-muted me-1" />
                      <small className="text-muted">{blog.author}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="text-muted me-1" />
                      <small className="text-muted">{blog.date}</small>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-0 pt-0">
                    <Link to={`/blog/${blog.id}`} className="btn btn-outline-primary w-100 rounded-pill">
                      Read More <FaArrowRight className="ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBlogs.length === 0 && (
            <div className="text-center py-5">
              <h4 className="text-muted">No blog posts found</h4>
              <p>Try a different search term or category</p>
            </div>
          )}
        </div>
      </section>

      {/* 🌟 Featured Post Section */}
      <section className="featured-post py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold section-title">Featured Post</h2>
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="row g-0">
              <div className="col-md-6">
                <img 
                  src="https://overatours.com/wp-content/uploads/2024/09/Tea-Plantations-to-Visit-in-Sri-Lanka.jpg" 
                  className="img-fluid h-100 featured-image" 
                  alt="Featured post" 
                  style={{objectFit: 'cover'}}
                />
              </div>
              <div className="col-md-6">
                <div className="card-body p-4 p-md-5">
                  <span className="badge bg-primary mb-2">Featured</span>
                  <h3 className="card-title">Exploring Sri Lanka's Tea Country</h3>
                  <p className="text-muted">
                    <FaUser className="me-1" /> By Travel Expert | <FaCalendarAlt className="me-1 ms-2" /> October 12, 2025
                  </p>
                  <p className="card-text">
                    Journey through the misty hills of Sri Lanka's central highlands, where lush tea plantations 
                    stretch as far as the eye can see. Discover the art of tea production, meet local planters, 
                    and enjoy breathtaking views that will stay with you long after you've returned home.
                  </p>
                  <div className="d-flex align-items-center mt-4">
                    <Link to="/blog/featured" className="btn btn-primary rounded-pill px-4 me-3">
                      Read Full Article
                    </Link>
                    <small className="text-muted">12 min read</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-item">
                <h3 className="fw-bold text-primary">250+</h3>
                <p className="text-muted">Blog Articles</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-item">
                <h3 className="fw-bold text-primary">50k+</h3>
                <p className="text-muted">Monthly Readers</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <h3 className="fw-bold text-primary">15+</h3>
                <p className="text-muted">Expert Writers</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <h3 className="fw-bold text-primary">95%</h3>
                <p className="text-muted">Reader Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📧 Newsletter Section */}
      <section className="newsletter-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h3 className="fw-bold">Stay Updated with Ceylon Travels</h3>
              <p>Get weekly travel inspiration, exclusive deals, and insider tips delivered straight to your inbox.</p>
            </div>
            <div className="col-md-6">
              <form onSubmit={handleSubscribe} className="d-flex">
                <input 
                  type="email" 
                  className="form-control me-2 rounded-pill border-0" 
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-light text-primary rounded-pill px-4">Join</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 Meet Our Authors Section */}
      <section className="authors-section py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold section-title">Meet Our Travel Experts</h2>
          <div className="row g-4">
            {[
              {
                name: "Chaminda Perera",
                role: "Nature Specialist",
                image: "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjEwMzQtZWxlbWVudC0wNy00MDMucG5n.png",
                posts: "42 articles"
              },
              {
                name: "Ishara Fernando",
                role: "Travel Planner",
                image: "https://www.pngkey.com/png/full/959-9597116_morrow-circle-headshot-blond.png",
                posts: "38 articles"
              },
              {
                name: "Nirmala Jayasinghe",
                role: "Food & Culture",
                image: "https://spng.pngfind.com/pngs/s/454-4546344_cs-headshots-05-girl-hd-png-download.png",
                posts: "29 articles"
              },
              {
                name: "Abdul Kareem",
                role: "Cultural Guide",
                image: "https://pngset.com/images/circle-headshot-headshot-circle-person-face-man-suit-transparent-png-1368014.png",
                posts: "31 articles"
              }
            ].map((author, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card border-0 text-center shadow-sm rounded-4 h-100 author-card">
                  <div className="card-body p-4">
                    <img 
                      src={author.image} 
                      alt={author.name} 
                      className="rounded-circle mb-3 author-image" 
                      width="100" 
                      height="100" 
                    />
                    <h5 className="card-title mb-1">{author.name}</h5>
                    <p className="text-muted small">{author.role}</p>
                    <p className="text-primary small">{author.posts}</p>
                    <button className="btn btn-outline-primary btn-sm rounded-pill mt-2">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add custom CSS for modern effects and animations */}
      <style jsx>{`
        .blog-hero {
          height: 60vh;
          background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e');
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .blog-hero .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(17, 13, 253, 0.1), rgba(32, 201, 151, 0.6));
        }

        .search-section .input-group {
          background: white;
          padding: 0.5rem;
        }

        .blog-card {
          transition: all 0.3s ease;
        }

        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(13, 110, 253, 0.15) !important;
        }

        .hover-zoom {
          transition: transform 0.5s ease;
        }

        .hover-zoom:hover {
          transform: scale(1.05);
        }

        .image-container {
          overflow: hidden;
        }

        .featured-image {
          transition: transform 0.5s ease;
        }

        .featured-post:hover .featured-image {
          transform: scale(1.03);
        }

        .newsletter-section {
          background: linear-gradient(135deg, #0d6efd 0%, #084298 100%);
          border-radius: 20px;
          margin: 40px;
        }

        .author-card {
          transition: all 0.3s ease;
        }

        .author-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
        }

        .author-image {
          transition: transform 0.3s ease;
        }

        .author-card:hover .author-image {
          transform: scale(1.1);
        }

        .stat-item {
          padding: 1.5rem;
          border-radius: 16px;
          background: rgba(13, 110, 253, 0.05);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          background: rgba(13, 110, 253, 0.1);
          transform: translateY(-3px);
        }

        /* Animations */
        .fade-in {
          animation: fadeIn 1s ease;
        }

        .slide-in-top {
          animation: slideInTop 0.8s ease;
        }

        .slide-in-bottom {
          animation: slideInBottom 0.8s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInTop {
          from { 
            opacity: 0;
            transform: translateY(-30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInBottom {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .newsletter-section {
            margin: 20px;
            text-align: center;
          }
          
          .blog-hero {
            height: 50vh;
          }
        }
      `}</style>
    </div>
  );
}

export default BlogPage;