import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Dashboard from './components/pages/Dashboard'
import ContentManager from './components/cms/ContentManager'
import Home from './components/pages/Home'
import LandingPage from './components/pages/LandingPage'
import Login from './components/pages/Login'
import './App.css'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3AA0FF]"></div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" />
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" />

  return children
}

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="cms"
          element={
            <ProtectedRoute requireAdmin>
              <ContentManager />
            </ProtectedRoute>
          }
        />
      </Route>

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