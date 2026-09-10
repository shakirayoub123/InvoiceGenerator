import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { SettingsProvider } from './contexts/SettingsContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import EnterpriseLayout from './layouts/EnterpriseLayout';

// Pages
import Home from './pages/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AdminInvoices from './components/AdminInvoices';
import AdminTemplates from './components/AdminTemplates';
import AdminSettings from './components/AdminSettings';

// --- AUTHENTICATION GUARD ---
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <SettingsProvider>
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '10px' } }} />
      <Router>
        <Routes>
          {/* Public Website Route */}
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />

          {/* Admin Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <EnterpriseLayout>
                <AdminDashboard />
              </EnterpriseLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/invoices" element={
            <ProtectedRoute>
              <EnterpriseLayout>
                <AdminInvoices />
              </EnterpriseLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/templates" element={
            <ProtectedRoute>
              <EnterpriseLayout>
                <AdminTemplates />
              </EnterpriseLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <EnterpriseLayout>
                <AdminSettings />
              </EnterpriseLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

export default App;
