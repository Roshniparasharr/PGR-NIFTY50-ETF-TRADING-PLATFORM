import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Admin from './layouts/Admin';
import Auth from './layouts/Auth';

// Views without layouts
import Profile from './views/user/Profile';
import Index from './views/user/Index';
import AboutHero from "./components/User/About/AboutHero";
import ContactPage from './components/User/Contact/ContactPage';
import ServicesPage from './components/User/Service/ServicesPage';
import CompanyDetailsPage from "./views/admin/CompanyDetail";

const App = () => {
  return (
    <Routes>
      {/* Routes with layouts */}
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/auth/*" element={<Auth />} />

      {/* Routes without layouts */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutHero />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/company/:symbol" element={<CompanyDetailsPage />} />

      {/* Redirect for unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;