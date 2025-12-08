// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


// Public Pages
import HomePage from "./pages/public/HomePage";
import SearchResultsPage from "./pages/public/SearchResultsPage.jsx";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import AllHotelsPage from "./pages/public/AllHotelsPage";
import AllToursPage from "./pages/public/AllToursPage";
import AllTransportPage from "./pages/public/AllTransportPage";
import AllDestinationsPage from "./pages/public/AllDestinationsPage";

import TourDetailsPage from "./pages/public/TourDetailsPage";
import HotelDetailsPage from './pages/public/HotelDetailsPage';
import TransportDetailPage from "./pages/public/TransportDetailPage";
import DestinationDetailsPage from './pages/public/DestinationDetailsPage';
import BlogPage from "./pages/public/BlogPage";
import ChatbotPage from "./pages/public/ChatbotPage";
import TermsPage from "./pages/public/TermsPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import BookingConfirmationPage from "./pages/public/BookingConfirmationPage";
import PaymentPage from "./pages/public/PaymentPage";
import PaymentSuccessPage from "./pages/public/PaymentSuccessPage";
import PaymentFailedPage from "./pages/public/PaymentFailedPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// DASHBOARD LAYOUT
import DashboardLayout from './pages/dashboard/layout/DashboardLayout';

// ADMIN DASHBOARD PAGES
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import ManageListings from './pages/dashboard/admin/ManageListings';
import Reports from './pages/dashboard/admin/Reports';

import AddDestination from './pages/dashboard/admin/AddDestination';
import EditDestination from './pages/dashboard/admin/EditDestination';
import DestinationsList from './pages/dashboard/admin/DestinationsList';

import HotelsList from './pages/dashboard/admin/HotelsList';
import AddHotel from './pages/dashboard/admin/AddHotel';
import EditHotel from './pages/dashboard/admin/EditHotel';

import TourPackagesList from './pages/dashboard/admin/TourPackagesList';
import AddTourPackage from './pages/dashboard/admin/AddTourPackage';
import EditTourPackage from './pages/dashboard/admin/EditTourPackage';


import AddTransport from './pages/dashboard/admin/AddTransport';
import EditTransport from './pages/dashboard/admin/EditTransport';
import TransportList from './pages/dashboard/admin/TransportList';

// CUSTOMER DASHBOARD PAGES
import CustomerDashboard from './pages/dashboard/customer/CustomerDashboard';
import MyBookings from './pages/dashboard/customer/MyBookings';
import Messages from './pages/dashboard/customer/Messages';
import ProfileSettings from './pages/dashboard/customer/ProfileSettings';
import HotelBooking from './pages/dashboard/customer/HotelBooking';

// Not Found Page
function NotFoundPage() {
  return (
    <div className="container text-center mt-5">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />

      {/* Main Route Views */}
      <div className="min-vh-100">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/listings/hotels" element={<AllHotelsPage />} />
          <Route path="/listings/tours" element={<AllToursPage />} />
          <Route path="/listings/transport" element={<AllTransportPage />} />
          <Route path="/listings/destinations" element={<AllDestinationsPage />} />
          <Route path="/tour-package/:id" element={<TourDetailsPage />} /> 
          <Route path="/destination/:id" element={<DestinationDetailsPage />} /> 
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route path="/transport/:id" element={<TransportDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Booking & Payment Routes */}
          <Route path="/public/book-hotel/:id" element={<HotelBooking />} />

          <Route path="/booking/confirm" element={<BookingConfirmationPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/failed" element={<PaymentFailedPage />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={<DashboardLayout role="admin" />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<ManageUsers />} />
            <Route path="admin/listings" element={<ManageListings />} />
            <Route path="admin/reports" element={<Reports />} />
            
            <Route path="admin/add-destination" element={<AddDestination />} />
            <Route path="admin/edit-destination/:id" element={<EditDestination />} />
            <Route path="admin/destinations" element={<DestinationsList />} />

            <Route path="admin/hotels" element={<HotelsList />} />
            <Route path="admin/add-hotel" element={<AddHotel />} />
            <Route path="admin/edit-hotel/:id" element={<EditHotel />} />

            <Route path="admin/tour-packages" element={<TourPackagesList />} />
            <Route path="admin/add-tour-package" element={<AddTourPackage />} />
            <Route path="admin/edit-tour-package/:id" element={<EditTourPackage />} />
            <Route path="admin/add-transport" element={<AddTransport />} />
            <Route path="admin/edit-transport/:id" element={<EditTransport />} />
            <Route path="admin/transports" element={<TransportList />} />

          </Route>
          <Route path="/dashboard" element={<DashboardLayout role="customer" />}>
            <Route path="customer" element={<CustomerDashboard />} />
            <Route path="customer/bookings" element={<MyBookings />} />
            <Route path="customer/messages" element={<Messages />} />
            <Route path="customer/profile" element={<ProfileSettings />} />
          </Route>
          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;