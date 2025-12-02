// src/pages/dashboard/customer/ProfileSettings.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaLock, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Sample user data
  const [userData, setUserData] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      bio: 'Travel enthusiast exploring the world one destination at a time. Love adventure activities and cultural experiences.',
      location: 'New York, USA',
      dateOfBirth: '1990-05-15'
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    preferences: {
      language: 'English',
      currency: 'USD',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      newsletter: true
    },
    social: {
      facebook: 'john.doe',
      twitter: 'johndoe',
      instagram: 'john.doe',
      linkedin: 'john-doe'
    }
  });

  const handleInputChange = (section, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subSection, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving data:', userData);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    // Reset form or fetch original data
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: <FaUser /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'preferences', label: 'Preferences', icon: <FaGlobe /> },
    { id: 'social', label: 'Social Profiles', icon: <FaFacebook /> }
  ];

  return (
    <div className="profile-settings">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark fw-bold mb-1">Profile Settings</h2>
          <p className="text-muted">Manage your account information and preferences</p>
        </div>
        {isEditing ? (
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <FaSave className="me-2" /> Save Changes
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="row">
        {/* Left Column - Profile Card First */}
        <div className="col-lg-3 mb-4 order-1">
          {/* Profile Card */}
          <div className="card border shadow-sm text-center mb-4">
            <div className="card-body">
              <div className="position-relative d-inline-block mb-3">
                <img 
                  src="https://media.licdn.com/dms/image/v2/D4D03AQECG4nkuapvLg/profile-displayphoto-scale_200_200/B4DZg1.M03H4AY-/0/1753252173619?e=1761782400&v=beta&t=5je6P8cZa_XGmCt0bvv8E6ehz8oLMuegqYOutNfBFTo" 
                  alt="Profile" 
                  className="rounded-circle"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                {isEditing && (
                  <label className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 cursor-pointer">
                    <FaCamera className="text-white" />
                    <input type="file" className="d-none" />
                  </label>
                )}
              </div>
              <h5 className="mb-1 text-black">{userData.profile.firstName} {userData.profile.lastName}</h5>
              <p className="text-muted mb-2">{userData.profile.email}</p>
              <p className="text-muted small">
                <FaMapMarkerAlt className="me-1" />
                {userData.profile.location}
              </p>
              <div className="d-flex justify-content-center gap-2 mt-3">
              <button type="button" className="btn btn-link text-primary p-0"><FaFacebook /></button>
              <button type="button" className="btn btn-link text-info p-0"><FaTwitter /></button>
              <button type="button" className="btn btn-link text-danger p-0"><FaInstagram /></button>
              <button type="button" className="btn btn-link text-primary p-0"><FaLinkedin /></button>
            </div>
            </div>
          </div>

          {/* Sidebar Navigation - Under Profile Card */}
          <div className="card border shadow-sm">
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="me-3">{tab.icon}</span>
                    <span className="text-black">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="col-lg-9 order-2">
          <div className="card border shadow-sm">
            <div className="card-body">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div className="tab-content">
                  <h5 className="mb-4 text-black">Personal Information</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">First Name</label>
                      <input
                        type="text"
                        className="form-control border text-black"
                        value={userData.profile.firstName}
                        onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">Last Name</label>
                      <input
                        type="text"
                        className="form-control border text-black"
                        value={userData.profile.lastName}
                        onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text border"><FaEnvelope /></span>
                        <input
                          type="email"
                          className="form-control border text-black"
                          value={userData.profile.email}
                          onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text border"><FaPhone /></span>
                        <input
                          type="tel"
                          className="form-control border text-black"
                          value={userData.profile.phone}
                          onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control border text-black"
                        value={userData.profile.dateOfBirth}
                        onChange={(e) => handleInputChange('profile', 'dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">Location</label>
                      <div className="input-group">
                        <span className="input-group-text border"><FaMapMarkerAlt /></span>
                        <input
                          type="text"
                          className="form-control border text-black"
                          value={userData.profile.location}
                          onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label text-black">Bio</label>
                      <textarea
                        className="form-control border text-black"
                        rows="4"
                        value={userData.profile.bio}
                        onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="tab-content">
                  <h5 className="mb-4 text-black">Security Settings</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">Current Password</label>
                      <input
                        type="password"
                        className="form-control border text-black"
                        value={userData.security.currentPassword}
                        onChange={(e) => handleInputChange('security', 'currentPassword', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="col-md-6 mb-3"></div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">New Password</label>
                      <input
                        type="password"
                        className="form-control border text-black"
                        value={userData.security.newPassword}
                        onChange={(e) => handleInputChange('security', 'newPassword', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control border text-black"
                        value={userData.security.confirmPassword}
                        onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="col-12">
                      <div className="alert alert-info">
                        <h6 className="alert-heading text-black">Password Requirements</h6>
                        <ul className="mb-0 ps-3 text-black">
                          <li>Minimum 8 characters</li>
                          <li>At least one uppercase letter</li>
                          <li>At least one number</li>
                          <li>At least one special character</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="tab-content">
                  <h5 className="mb-4 text-black">Preferences</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">Language</label>
                      <select
                        className="form-select border text-black"
                        value={userData.preferences.language}
                        onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-black">Currency</label>
                      <select
                        className="form-select border text-black"
                        value={userData.preferences.currency}
                        onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                    <div className="col-12 mb-4">
                      <h6 className="mb-3 text-black">Notification Preferences</h6>
                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={userData.preferences.notifications.email}
                          onChange={(e) => handleNestedInputChange('preferences', 'notifications', 'email', e.target.checked)}
                          disabled={!isEditing}
                        />
                        <label className="form-check-label text-black">Email Notifications</label>
                      </div>
                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={userData.preferences.notifications.sms}
                          onChange={(e) => handleNestedInputChange('preferences', 'notifications', 'sms', e.target.checked)}
                          disabled={!isEditing}
                        />
                        <label className="form-check-label text-black">SMS Notifications</label>
                      </div>
                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={userData.preferences.notifications.push}
                          onChange={(e) => handleNestedInputChange('preferences', 'notifications', 'push', e.target.checked)}
                          disabled={!isEditing}
                        />
                        <label className="form-check-label text-black">Push Notifications</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={userData.preferences.newsletter}
                          onChange={(e) => handleInputChange('preferences', 'newsletter', e.target.checked)}
                          disabled={!isEditing}
                        />
                        <label className="form-check-label text-black">
                          Subscribe to newsletter for travel tips and exclusive offers
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Profiles Tab */}
              {activeTab === 'social' && (
                <div className="tab-content">
                  <h5 className="mb-4 text-black">Social Profiles</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label d-flex align-items-center text-black">
                        <FaFacebook className="text-primary me-2" /> Facebook
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border">facebook.com/</span>
                        <input
                          type="text"
                          className="form-control border text-black"
                          value={userData.social.facebook}
                          onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                          disabled={!isEditing}
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label d-flex align-items-center text-black">
                        <FaTwitter className="text-info me-2" /> Twitter
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border">twitter.com/</span>
                        <input
                          type="text"
                          className="form-control border text-black"
                          value={userData.social.twitter}
                          onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                          disabled={!isEditing}
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label d-flex align-items-center text-black">
                        <FaInstagram className="text-danger me-2" /> Instagram
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border">instagram.com/</span>
                        <input
                          type="text"
                          className="form-control border text-black"
                          value={userData.social.instagram}
                          onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                          disabled={!isEditing}
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label d-flex align-items-center text-black">
                        <FaLinkedin className="text-primary me-2" /> LinkedIn
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border">linkedin.com/in/</span>
                        <input
                          type="text"
                          className="form-control border text-black"
                          value={userData.social.linkedin}
                          onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)}
                          disabled={!isEditing}
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;