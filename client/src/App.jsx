import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './componenets/pages/landing.jsx'
import Dashboard from './componenets/pages/dashboard.jsx'
import Login from './componenets/pages/login.jsx'
import Signup from './componenets/pages/signup.jsx'
import Trainer from './componenets/pages/trainer.jsx'
import Community from './componenets/pages/community.jsx'
import Profile from './componenets/pages/profile.jsx'
import StatsDashboard from './componenets/pages/statsDashboard.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stats" element={<StatsDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
