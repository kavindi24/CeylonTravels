// src/pages/dashboard/admin/ManageAllListings.jsx
import React, { useState } from 'react';
import { 
  FaSearch, FaFilter, FaEdit, FaTrash,
   FaHotel, FaRoute, FaMapMarkedAlt, 
  FaMountain, FaPlus, FaStar, FaMapMarkerAlt,
  FaSwimmingPool, FaWifi, FaUtensils, FaParking, FaSpa,
  FaLandmark, FaUmbrellaBeach, FaTree,
} from 'react-icons/fa'; 

function ManageAllListings() {
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingListing, setEditingListing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Sample data for hotels, tours, and destinations
  const allListings = [
    // Hotels
    {
      id: 1,
      name: "Cape Weligama",
      type: "hotel",
      owner: "Luxury Resorts Ltd.",
      status: "approved",
      created: "2023-10-15",
      rating: 5,
      price: "LKR 18,000",
      period: "night",
      location: "Weligama",
      description: "Luxury resort with stunning ocean views and private pools",
      amenities: ["Pool", "WiFi", "Restaurant", "Parking", "Spa"],
      contactEmail: "info@capeweligama.com",
      contactPhone: "+94112345678",
      image: "https://www.andbeyond.com/wp-content/uploads/sites/5/Guest-Entrance-At-Cape-Weligama.jpg"
    },
    {
      id: 2,
      name: "Heritance Kandalama",
      type: "hotel", 
      owner: "Heritance Hotels",
      status: "approved",
      created: "2023-09-20",
      rating: 5,
      price: "LKR 14,000",
      period: "night",
      location: "Dambulla",
      description: "Architectural marvel blending with nature near Sigiriya",
      amenities: ["Pool", "WiFi", "Restaurant", "Parking", "Spa"],
      contactEmail: "reservations@heritancekandalama.com",
      contactPhone: "+94119876543",
      image: "https://classicsafaricompany.com.au/wp-content/uploads/heritance-kandalama-pool.jpg"
    },
    {
      id: 3,
      name: "Galle Fort Hotel",
      type: "hotel",
      owner: "Boutique Hotels Group",
      status: "approved",
      created: "2023-11-05",
      rating: 4,
      price: "LKR 16,000",
      period: "night",
      location: "Galle",
      description: "Boutique hotel in a restored Dutch mansion within Galle Fort",
      amenities: ["Pool", "WiFi", "Restaurant", "Parking"],
      contactEmail: "bookings@galleforthotel.com",
      contactPhone: "+94117778899",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/59/dd/e0/pool.jpg?w=900&h=500&s=1"
    },
    {
      id: 4,
      name: "Tea Factory Hotel",
      type: "hotel",
      owner: "Hill Country Resorts",
      status: "approved",
      created: "2023-08-12",
      rating: 4,
      price: "LKR 15,000",
      period: "night",
      location: "Nuwara Eliya",
      description: "Unique hotel converted from a tea factory in hill country",
      amenities: ["Pool", "WiFi", "Restaurant", "Parking"],
      contactEmail: "info@teafactoryhotel.com",
      contactPhone: "+94115556677",
      image: "https://www.uniqhotels.com/media/cache/7c/6d/7c6d374348cae1af0a94a32717effc64.jpg"
    },
    {
      id: 5,
      name: "Cinnamon Grand Colombo",
      type: "hotel",
      owner: "Cinnamon Hotels & Resorts",
      status: "approved",
      created: "2023-07-22",
      rating: 5,
      price: "LKR 23,000",
      period: "night",
      location: "Colombo",
      description: "Luxury hotel in the heart of Colombo with beach access",
      amenities: ["Pool", "WiFi", "Restaurant", "Parking", "Spa", "Gym"],
      contactEmail: "reservations@cinnamongrand.com",
      contactPhone: "+94119998877",
      image: "https://d18slle4wlf9ku.cloudfront.net/www.cinnamonhotels.com-1302818674/cms/cache/v2/66bd61ab411ad.jpg/1920x1080/fit/80/e025f0c5fa81a93236d946f06d436f9c.jpg"
    },
    {
      id: 6,
      name: "Jetwing Lighthouse",
      type: "hotel",
      owner: "Jetwing Hotels",
      status: "approved",
      created: "2023-06-10",
      rating: 4,
      price: "LKR 18,000",
      period: "night",
      location: "Galle",
      description: "Seafront hotel near Galle Fort with great views",
      amenities: ["Pool", "WiFi", "Restaurant", "Parking", "Beach Access"],
      contactEmail: "info@jetwinglighthouse.com",
      contactPhone: "+94116665544",
      image: "https://www.jetwinghotels.com/jetwinglighthouse/wp-content/uploads/sites/24/2022/01/Desktop-CV-5.jpg"
    },
    {
      id: 7,
      name: "Earl's Regency Hotel",
      type: "hotel",
      owner: "Aitken Spence Hotels",
      status: "pending",
      created: "2023-12-01",
      rating: 4,
      price: "LKR 15,000",
      period: "night",
      location: "Kandy",
      description: "Scenic hotel with mountain views in cultural capital",
      amenities: ["Pool", "WiFi", "Restaurant", "Parking", "Mountain View"],
      contactEmail: "bookings@earlsregency.com",
      contactPhone: "+94111234567",
      image: "https://d3a2q5al71qg9.cloudfront.net/sites/2/2021/01/Slide4.jpg"
    },
    {
      id: 8,
      name: "Anantara Peace Haven",
      type: "hotel",
      owner: "Anantara Hotels",
      status: "approved",
      created: "2023-05-15",
      rating: 5,
      price: "LKR 32,000",
      period: "night",
      location: "Tangalle",
      description: "Luxury beachfront resort with spa and fine dining",
      amenities: ["Pool", "WiFi", "Restaurant", "Parking", "Spa", "Beachfront"],
      contactEmail: "reservations@anantara.com",
      contactPhone: "+94118889900",
      image: "https://res.cloudinary.com/destinology/q_auto,f_auto,c_scale/AccommImages/42877/image/76f2c4b78d9b4d0b9b4d07c6b6dc94db.jpg"
    },
    // Tours
    {
      id: 101,
      name: "Sigiriya & Dambulla Day Tour",
      type: "tour",
      owner: "Cultural Tours Lanka",
      status: "approved",
      created: "2023-11-10",
      rating: 4.9,
      price: "LKR 9,500",
      period: "person",
      location: "Dambulla",
      description: "Explore two UNESCO World Heritage Sites in one day with our expert guides",
      amenities: ["Guide", "Transport", "Lunch", "Entrance Fees"],
      contactEmail: "bookings@culturaltours.com",
      contactPhone: "+94112223344",
      image: "https://www.bestoflanka.com/images/slider/daytours/sigiriya_dambulla_day_trip_departing_from_kandy/01.jpg"
    },
    {
      id: 102,
      name: "Yala National Park Safari",
      type: "tour",
      owner: "Wildlife Adventures",
      status: "pending",
      created: "2023-12-05",
      rating: 4.7,
      price: "LKR 12,500",
      period: "person",
      location: "Yala",
      description: "Embark on an exciting wildlife adventure in Sri Lanka's most famous national park",
      amenities: ["Jeep Safari", "Tracker", "Refreshments"],
      contactEmail: "info@wildlifeadventures.com",
      contactPhone: "+94113334455",
      image: "https://res.cloudinary.com/enchanting/image/upload/v1/artemis-mdm/places/b9d4840f-846c-4f68-af0f-5fba9418b764.jpg"
    },
     // Transport
    {
      id: 301,
      name: "Private Airport Pickup",
      type: "transport",
      owner: "Colombo Transfers",
      status: "approved",
      created: "2023-10-20",
      rating: 4.8,
      price: "LKR 4,500",
      period: "trip",
      location: "Colombo Airport",
      description: "Comfortable private transfer from Colombo Airport to your hotel in a Toyota Prius",
      amenities: ["AC", "Private", "Door Pickup", "English Speaking Driver"],
      contactEmail: "bookings@colombotransfers.com",
      contactPhone: "+94112233445",
      image: "https://bdc2020.o0bc.com/wp-content/uploads/2017/01/2017-Toyota-Prius-Prime-scaled.jpg",
      vehicle: "Toyota Prius",
      seats: 3,
      duration: "1-2 hours"
    },
    {
      id: 302,
      name: "Ella to Kandy Scenic Drive",
      type: "transport",
      owner: "Hill Country Travel",
      status: "approved",
      created: "2023-09-15",
      rating: 4.9,
      price: "LKR 8,500",
      period: "trip",
      location: "Ella",
      description: "Scenic drive through tea country with stops at viewpoints and attractions",
      amenities: ["Scenic Route", "English Guide", "Comfortable Seats"],
      contactEmail: "info@hillcountrytravel.com",
      contactPhone: "+94113334455",
      image: "https://admin.beleon.com/transferMediaResource/00/001/453.jpg?w=1140&h=600&mode=crop&scale=both",
      vehicle: "Van - 6 Seats",
      seats: 6,
      duration: "6-7 hours"
    },
    {
      id: 303,
      name: "Colombo City Tuk-Tuk Tour",
      type: "transport",
      owner: "Urban Adventures",
      status: "approved",
      created: "2023-11-05",
      rating: 4.7,
      price: "LKR 3,000",
      period: "tour",
      location: "Colombo",
      description: "Fun and authentic way to explore Colombo's highlights in a traditional tuk-tuk",
      amenities: ["Open Air", "City Tour", "Fun Ride", "Local Guide"],
      contactEmail: "tours@urbanadventures.com",
      contactPhone: "+94114445566",
      image: "https://55secrets.com/wp-content/uploads/2019/02/DSC08956-1.jpg",
      vehicle: "Tuk Tuk",
      seats: 2,
      duration: "3 hours"
    },
    {
      id: 304,
      name: "Yala Safari Jeep Rental",
      type: "transport",
      owner: "Wildlife Safaris",
      status: "pending",
      created: "2023-12-10",
      rating: 4.6,
      price: "LKR 12,000",
      period: "day",
      location: "Yala",
      description: "Full-day jeep rental with driver for Yala National Park safari",
      amenities: ["4WD", "Experienced Driver", "Binoculars Provided"],
      contactEmail: "safaris@wildlifesl.com",
      contactPhone: "+94115556677",
      image: "https://www.srilankansafari.com/wp-content/uploads/2019/10/jeep-safari-yala.jpg",
      vehicle: "Safari Jeep",
      seats: 6,
      duration: "Full day"
    },
    {
      id: 305,
      name: "Kandy to Nuwara Eliya Train Tickets",
      type: "transport",
      owner: "Railway Tours",
      status: "approved",
      created: "2023-08-25",
      rating: 4.8,
      price: "LKR 1,500",
      period: "person",
      location: "Kandy",
      description: "Reserved seats on the scenic train journey through tea country",
      amenities: ["Scenic Views", "Comfortable Seats", "Tea Country"],
      contactEmail: "tickets@railwaytours.com",
      contactPhone: "+94116667788",
      image: "https://www.ceylonexpeditions.com/storage/app/media/Scenic%20Train%20Ride%20in%20Sri%20Lanka.jpg",
      vehicle: "Train",
      seats: 1,
      duration: "4 hours"
    },
    // Destinations
    {
      id: 201,
      name: "Ella",
      type: "destination",
      owner: "Tourism Board",
      status: "approved",
      created: "2023-08-20",
      rating: 4.8,
      price: "Free",
      period: "visit",
      location: "Uva Province",
      description: "Scenic mountain town with lush green hills and iconic railway",
      amenities: ["Hiking", "Nature", "Railway", "Waterfalls"],
      contactEmail: "info@ella-tourism.com",
      contactPhone: "+94115556677",
      image: "https://vietnamdecouverte.com/pic/blog/4e02803f-520b-4160-9270-1880e4c58284.jpeg"
    },
    {
      id: 202,
      name: "Galle Fort",
      type: "destination",
      owner: "Cultural Heritage Trust",
      status: "approved",
      created: "2023-07-15",
      rating: 4.7,
      price: "Free",
      period: "visit",
      location: "Galle",
      description: "Historic Dutch fort with charming streets and coastal views",
      amenities: ["History", "Architecture", "Shopping", "Dining"],
      contactEmail: "info@gallefort.com",
      contactPhone: "+94116667788",
      image: "https://content.r9cdn.net/rimg/dimg/a7/5e/9c5db968-city-43529-1665972f0ba.jpg?width=1366&height=768&xhint=1979&yhint=2141&crop=true"
    }
    
  ];

  // Filter listings based on search, status, and type
  const filteredListings = allListings.filter(listing => {
    const matchesStatus = filter === 'all' || listing.status === filter;
    const matchesType = typeFilter === 'all' || listing.type === typeFilter;
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         listing.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });


  // Handle deletion
  const deleteListing = (id) => {
    // In a real app, this would make an API call
    if (window.confirm('Are you sure you want to delete this listing?')) {
      console.log(`Deleting listing ${id}`);
      alert(`Listing ${id} deleted successfully`);
    }
  };

  // Handle editing
  const editListing = (listing) => {
    setEditingListing(listing);
    setShowEditModal(true);
  };

  // Handle saving edits
  const saveListing = (updatedListing) => {
    // In a real app, this would make an API call
    console.log('Saving updated listing:', updatedListing);
    setShowEditModal(false);
    setEditingListing(null);
    alert('Listing updated successfully');
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { class: 'bg-success', text: 'Active' },
      pending: { class: 'bg-warning', text: 'Pending' },
      blocked: { class: 'bg-danger', text: 'Blocked' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: 'Unknown' };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  // Get type icon
  const getTypeIcon = (type) => {
    const icons = {
      hotel: <FaHotel className="text-primary" />,
      tour: <FaRoute className="text-info" />,
      destination: <FaMapMarkedAlt className="text-success" />,
      transport: <FaMapMarkerAlt className="text-warning" />
    };
    return icons[type] || <FaHotel className="text-muted" />;
  };

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    const icons = {
      'Pool': <FaSwimmingPool className="text-primary" />,
      'WiFi': <FaWifi className="text-info" />,
      'Restaurant': <FaUtensils className="text-warning" />,
      'Parking': <FaParking className="text-secondary" />,
      'Spa': <FaSpa className="text-danger" />,
      'Gym': <FaHotel className="text-success" />,
      'Beach Access': <FaUmbrellaBeach className="text-info" />,
      'Mountain View': <FaMountain className="text-success" />,
      'Beachfront': <FaUmbrellaBeach className="text-primary" />,
      'Guide': <FaUser className="text-info" />,
      'Transport': <FaCar className="text-warning" />,
      'Lunch': <FaUtensils className="text-success" />,
      'Entrance Fees': <FaTicketAlt className="text-primary" />,
      'Jeep Safari': <FaCar className="text-danger" />,
      'Tracker': <FaUser className="text-info" />,
      'Refreshments': <FaCoffee className="text-secondary" />,
      'Hiking': <FaHiking className="text-success" />,
      'Nature': <FaTree className="text-success" />,
      'Railway': <FaTrain className="text-primary" />,
      'Waterfalls': <FaWater className="text-info" />,
      'History': <FaLandmark className="text-warning" />,
      'Architecture': <FaBuilding className="text-secondary" />,
      'Shopping': <FaShoppingBag className="text-primary" />,
      'Dining': <FaUtensils className="text-danger" />
    };
    return icons[amenity] || <FaHotel className="text-muted" />;
  };

  return (
    <div className="manage-listings">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1 fw-bold" style={{ color: '#1f2937' }}>Listings</h2>
          <p className="text-muted mb-0">No of Listings: {allListings.length}</p>
        </div>
        <button className="btn btn-primary">
          <FaPlus className="me-2" /> Add New Listing
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body p-3">
          <div className="row align-items-center">
            <div className="col-md-5 mb-3 mb-md-0">
              <div className="input-group" style={{ border: '1px solid #ced4da', borderRadius: '0.375rem' }}>
                <span className="input-group-text bg-white border-0">
                  <FaSearch className="text-gray-500" />
                </span>
                <input 
                  type="text" 
                  className="form-control border-0" 
                  placeholder="Search by name, owner, or location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ boxShadow: 'none' }}
                />
              </div>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <span className="me-2 text-muted"><FaFilter /></span>
                <select 
                  className="form-select" 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Active</option>
                  <option value="pending">Pending Review</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <span className="me-2 text-muted"><FaFilter /></span>
                <select 
                  className="form-select" 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="hotel">Hotels</option>
                  <option value="tour">Tours</option>
                  <option value="transport">Transport</option>
                  <option value="destination">Destinations</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Cards View */}
      <div className="row">
        {filteredListings.length > 0 ? (
          filteredListings.map(listing => (
            <div key={listing.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div 
                  className="card-img-top" 
                  style={{ 
                    height: '200px', 
                    backgroundImage: `url(${listing.image})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                  }}
                ></div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title fw-bold mb-0">{listing.name}</h5>
                    {getStatusBadge(listing.status)}
                  </div>
                  
                  <div className="d-flex align-items-center text-muted mb-2">
                    {getTypeIcon(listing.type)}
                    <span className="ms-2 text-capitalize">{listing.type}</span>
                    <span className="mx-2">•</span>
                    <FaMapMarkerAlt className="me-2" />
                    <small>{listing.location}</small>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="h5 text-primary mb-0">
                      {listing.price} <small className="text-muted">/ {listing.period}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaStar className="text-warning me-1" />
                      <span>{listing.rating}</span>
                    </div>
                  </div>
                  
                  <p className="card-text text-muted small mb-3">{listing.description}</p>
                  
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      {listing.amenities.slice(0, 4).map((amenity, index) => (
                        <span key={index} className="bg-light rounded p-2" title={amenity}>
                          {getAmenityIcon(amenity)}
                        </span>
                      ))}
                      {listing.amenities.length > 4 && (
                        <span className="bg-light rounded p-2" title={`+${listing.amenities.length - 4} more`}>
                          +{listing.amenities.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => editListing(listing)}
                    >
                      <FaEdit className="me-1" /> Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteListing(listing.id)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5 text-muted">
            <FaSearch size="2rem" className="mb-3" />
            <p>No listings found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="row mt-4">
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-primary bg-opacity-10 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <h4 className="text-primary mb-0">{allListings.length}</h4>
              <small className="text-muted">Total Listings</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-success bg-opacity-10 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <h4 className="text-success mb-0">{allListings.filter(l => l.status === 'approved').length}</h4>
              <small className="text-muted">Active</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-warning bg-opacity-10 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <h4 className="text-warning mb-0">{allListings.filter(l => l.status === 'pending').length}</h4>
              <small className="text-muted">Pending</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-danger bg-opacity-10 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <h4 className="text-danger mb-0">{allListings.filter(l => l.status === 'blocked').length}</h4>
              <small className="text-muted">Blocked</small>
            </div>
          </div>
        </div>
      </div>

      {/* Type Summary */}
      <div className="row mt-2">
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-info bg-opacity-10 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <h4 className="text-info mb-0">{allListings.filter(l => l.type === 'hotel').length}</h4>
              <small className="text-muted">Hotels</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-purple bg-opacity-10 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <h4 className="text-purple mb-0">{allListings.filter(l => l.type === 'tour').length}</h4>
              <small className="text-muted">Tours</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-warning bg-opacity-10 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <h4 className="text-warning mb-0">{allListings.filter(l => l.type === 'destination').length}</h4>
              <small className="text-muted">Destinations</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card border-0 bg-secondary bg-opacity-10 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body text-center p-3">
              <h4 className="text-secondary mb-0">{allListings.filter(l => l.type === 'transport').length}</h4>
              <small className="text-muted">Transport</small>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingListing && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Listing: {editingListing.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        defaultValue={editingListing.name}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Type</label>
                      <select className="form-select" defaultValue={editingListing.type}>
                        <option value="hotel">Hotel</option>
                        <option value="tour">Tour</option>
                        <option value="transport">Transport</option>
                        <option value="destination">Destination</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Owner</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        defaultValue={editingListing.owner}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Location</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        defaultValue={editingListing.location}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      defaultValue={editingListing.description}
                    ></textarea>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Price</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        defaultValue={editingListing.price}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Period</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        defaultValue={editingListing.period}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Rating</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="5" 
                        className="form-control" 
                        defaultValue={editingListing.rating}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Contact Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        defaultValue={editingListing.contactEmail}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Contact Phone</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        defaultValue={editingListing.contactPhone}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      defaultValue={editingListing.image}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" defaultValue={editingListing.status}>
                      <option value="approved">Active</option>
                      <option value="pending">Pending</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={() => saveListing(editingListing)}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bg-primary-subtle { background-color: #e3f2fd !important; }
        .bg-purple { color: #6f42c1; }
        .bg-orange { color: #fd7e14; }
        .bg-pink { color: #d63384; }
        
        .card-title {
          color: #1f2937;
          font-size: 1.1rem;
        }
        
        .badge {
          font-size: 0.7rem;
          padding: 0.35em 0.65em;
        }
      `}</style>
    </div>
  );
}

// Add missing icon components
const FaUser = () => <span>👤</span>;
const FaCar = () => <span>🚗</span>;
const FaTicketAlt = () => <span>🎫</span>;
const FaCoffee = () => <span>☕</span>;
const FaHiking = () => <span>🥾</span>;
const FaTrain = () => <span>🚂</span>;
const FaWater = () => <span>💧</span>;
const FaBuilding = () => <span>🏢</span>;
const FaShoppingBag = () => <span>🛍️</span>;

export default ManageAllListings; 