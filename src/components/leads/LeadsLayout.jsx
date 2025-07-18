import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiUsers } = FiIcons

const LeadsLayout = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <SafeIcon icon={FiUsers} className="w-8 h-8 text-picton-blue" />
        <div>
          <h1 className="text-3xl font-bold text-polynesian-blue">Lead Management</h1>
          <p className="text-polynesian-blue/70">Track and manage your potential clients</p>
        </div>
      </motion.div>
      
      <Outlet />
    </div>
  )
}

export default LeadsLayout