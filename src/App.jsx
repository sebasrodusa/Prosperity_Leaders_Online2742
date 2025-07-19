import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Dashboard from './components/pages/Dashboard'
import ContentManager from './components/cms/ContentManager'
import ProfessionalProfile from './components/dashboard/ProfessionalProfile'
import MyLandingPages from './components/dashboard/MyLandingPages'
import LeadsLayout from './components/leads/LeadsLayout'
import LeadsDashboard from './components/leads/LeadsDashboard'
import CreateLead from './components/leads/CreateLead'
import LeadDetails from './components/leads/LeadDetails'
import BlogManager from './components/blog/BlogManager'
import AgentBlogSubmission from './components/blog/AgentBlogSubmission'
import BlogList from './components/blog/BlogList'
import BlogPost from './components/blog/BlogPost'
import ProfessionalDirectory from './components/professional-directory/ProfessionalDirectory'
import Home from './components/pages/Home'
import LandingPage from './components/pages/LandingPage'
import ProfilePage from './components/pages/ProfilePage'
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
      
      {/* Public Routes */}
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/find-a-professional" element={<ProfessionalDirectory />} />

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
        <Route path="professional-profile" element={<ProfessionalProfile />} />
        <Route path="landing-pages" element={<MyLandingPages />} />
        <Route path="blog-submission" element={<AgentBlogSubmission />} />
        
        {/* Leads Routes */}
        <Route path="leads" element={<LeadsLayout />}>
          <Route index element={<LeadsDashboard />} />
          <Route path="new" element={<CreateLead />} />
          <Route path=":id" element={<LeadDetails />} />
        </Route>

        {/* Admin Only Routes */}
        <Route
          path="blog-manager"
          element={
            <ProtectedRoute requireAdmin>
              <BlogManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="cms"
          element={
            <ProtectedRoute requireAdmin>
              <ContentManager />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Public Profile & Landing Pages Routes */}
      <Route path="/:username" element={<ProfilePage />} />
      <Route path="/:username/:custom" element={<LandingPage />} />
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