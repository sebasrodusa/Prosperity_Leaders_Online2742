import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import DashboardStats from '../dashboard/DashboardStats'
import ProfileEditor from '../dashboard/ProfileEditor'
import PagesManager from '../dashboard/PagesManager'
import MainNav from '../layout/MainNav'

const Dashboard = () => {
  const { user } = useAuth()
  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    ''

  return (
    <div className="min-h-screen bg-anti-flash-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-polynesian-blue">
            Welcome back, {displayName}!
          </h1>
          <p className="text-polynesian-blue/70 mt-2">
            Manage your profile and landing pages from your dashboard.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Stats Overview */}
          <section>
            <h2 className="text-xl font-semibold text-polynesian-blue mb-4">Overview</h2>
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
