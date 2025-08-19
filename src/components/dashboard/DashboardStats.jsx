import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const { FiEye, FiUsers, FiGlobe, FiTrendingUp } = FiIcons

const DashboardStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total_page_views: 0,
    active_pages: 0,
    leads_generated: 0,
    conversion_rate: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return
      const { data, error } = await supabase.rpc('get_user_dashboard_stats', {
        user_id: user.id
      })
      if (error) {
        console.error('Error fetching dashboard stats:', error)
        return
      }
      if (data) setStats(data)
    }

    fetchStats()
  }, [user])

  const statItems = [
    {
      title: 'Total Page Views',
      value: stats.total_page_views,
      icon: FiEye,
      color: 'text-picton-blue',
      bgColor: 'bg-picton-blue/10'
    },
    {
      title: 'Active Pages',
      value: stats.active_pages,
      icon: FiGlobe,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Leads Generated',
      value: stats.leads_generated,
      icon: FiUsers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversion_rate}%`,
      icon: FiTrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-polynesian-blue/70">{stat.title}</p>
                <p className="text-2xl font-bold text-polynesian-blue mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default DashboardStats
