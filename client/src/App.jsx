
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './components/pages/landing.jsx'
import Login from './components/pages/login.jsx'
import Signup from './components/pages/signup.jsx'
import Profile from './components/pages/profile.jsx'

// App Layout & Pages
import AppLayout from './components/layout/appLayout.jsx'

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
