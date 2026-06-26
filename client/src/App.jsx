import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './componenets/pages/landing.jsx'
import Login from './componenets/pages/login.jsx'
import Signup from './componenets/pages/signup.jsx'
import Profile from './componenets/pages/profile.jsx'

// App Layout & Pages
import AppLayout from './componenets/layout/appLayout.jsx'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

        {/* Main Application Layout (Handles its own sub-routes) */}
        <Route path="/app/*" element={<AppLayout />} />
        
        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/app" />} />
      </Routes>
    </Router>
  )
}

export default App
