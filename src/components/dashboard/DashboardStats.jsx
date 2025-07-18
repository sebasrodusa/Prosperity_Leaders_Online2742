import React from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiEye, FiUsers, FiGlobe, FiTrendingUp } = FiIcons

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Page Views',
      value: '2,847',
      change: '+12.3%',
      icon: FiEye,
      color: 'text-picton-blue',
      bgColor: 'bg-picton-blue/10'
    },
    {
      title: 'Active Pages',
      value: '3',
      change: '+1',
      icon: FiGlobe,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Leads Generated',
      value: '24',
      change: '+8.1%',
      icon: FiUsers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: '+0.5%',
      icon: FiTrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
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
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
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