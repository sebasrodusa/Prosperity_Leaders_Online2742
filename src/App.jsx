import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider, useAuth as useAuthContext } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Dashboard from './components/pages/Dashboard'
import ContentManager from './components/cms/ContentManager'
import ProfessionalProfile from './components/dashboard/ProfessionalProfile'
import MyLandingPages from './components/dashboard/MyLandingPages'
import LandingPageBuilder from './components/landingPages/LandingPageBuilder'
import ResourcesCenter from './components/resources/ResourcesCenter'
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
import JennyBooking from './components/pages/JennyBooking'
import LandingPage from './components/pages/LandingPage'
import ProfilePage from './components/pages/ProfilePage'
import Login from './components/pages/Login'
import EnhancedSignup from './components/pages/EnhancedSignup'
import SebastianBooking from './components/pages/SebastianBooking'
import ExamfxPreLicense from './components/pages/ExamfxPreLicense'
import AgentLinks from './components/pages/AgentLinks'
import './App.css'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuthContext()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#1C1F2A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3AA0FF]"></div>
      </div>
    )
  }
  
  if (!user) return <Navigate to="/login" />
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" />
  
  return children
}

const LegacyLandingPageRedirect = () => {
  const { custom_username } = useParams()
  return <Navigate to={`/pages/${custom_username}`} replace />
}

const AppRoutes = () => {
  const { user } = useAuthContext()
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={<EnhancedSignup />} />
      <Route path="/jenny" element={<JennyBooking />} />
      
      {/* Public Routes */}
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/find-a-professional" element={<ProfessionalDirectory />} />
      <Route path="/sebastian" element={<SebastianBooking />} />
      <Route path="/examfx" element={<ExamfxPreLicense />} />
      <Route path="/agents" element={<AgentLinks />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="professional-profile" element={<ProfessionalProfile />} />
        <Route path="landing-pages" element={<MyLandingPages />} />
        <Route path="landing-pages/:id/edit" element={<LandingPageBuilder />} />
        <Route path="resources" element={<ResourcesCenter />} />
        <Route path="blog-submission" element={<AgentBlogSubmission />} />
        
        {/* Leads Routes */}
        <Route path="leads" element={<LeadsLayout />}>
          <Route index element={<LeadsDashboard />} />
          <Route path="new" element={<CreateLead />} />
          <Route path=":id" element={<LeadDetails />} />
        </Route>
        
        {/* Admin Only Routes */}
        <Route path="blog-manager" element={<ProtectedRoute requireAdmin><BlogManager /></ProtectedRoute>} />
        <Route path="cms" element={<ProtectedRoute requireAdmin><ContentManager /></ProtectedRoute>} />
      </Route>
      
      {/* Public Profile & Landing Pages Routes */}
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/pages/:custom_username" element={<LandingPage />} />
      <Route path="/:custom_username" element={<LegacyLandingPageRedirect />} />
    </Routes>
  )
}

function App() {

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
