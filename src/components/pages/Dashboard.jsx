import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Header from '../layout/Header'
import DashboardStats from '../dashboard/DashboardStats'
import ProfileEditor from '../dashboard/ProfileEditor'
import PagesManager from '../dashboard/PagesManager'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your profile and landing pages from your dashboard.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Stats Overview */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
            <DashboardStats />
          </section>

          {/* Pages Manager */}
          <section>
            <PagesManager />
          </section>

          {/* Profile Editor */}
          <section>
            <ProfileEditor />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard