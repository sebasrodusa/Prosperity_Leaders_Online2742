import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './components/pages/Dashboard'
import LandingPage from './components/pages/LandingPage'
import Login from './components/pages/Login'
import HomePage from './components/pages/HomePage'
import './App.css'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/:username" element={<LandingPage />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App