import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './services/store';
import { initiateSocketConnection, disconnectSocket } from './services/socket';
import Landing from './components/pages/landing.jsx';
import Login from './components/pages/login.jsx';
import Signup from './components/pages/signup.jsx';
import Profile from './components/pages/profile.jsx';
import Privacy from './components/pages/privacy.jsx';
import Terms from './components/pages/terms.jsx';

// App Layout & Pages
import AppLayout from './components/layout/appLayout.jsx';

import './App.css';

// Simple Route Guard for authenticated users
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const fetchMe = useStore((state) => state.fetchMe);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        initiateSocketConnection(token);
      }
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/:username" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/*" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/app" />} />
      </Routes>
    </Router>
  );
}

export default App;
