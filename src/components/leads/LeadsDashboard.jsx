import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getLeads, getLeadStats } from '../../lib/leads'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const {
  FiPlus,
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUser,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUsers
} = FiIcons

const LeadsDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const statusOptions = [
    { value: 'all', label: 'All Leads', color: 'bg-gray-100' },
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'bg-purple-100 text-purple-800' },
    { value: 'follow_up', label: 'Follow-Up', color: 'bg-orange-100 text-orange-800' },
    { value: 'closed_won', label: 'Closed Won', color: 'bg-green-100 text-green-800' },
    { value: 'closed_lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    loadLeads()
    loadStats()
  }, [user])

  const loadLeads = async () => {
    try {
      setLoading(true)
      const data = await getLeads(user.id)
      setLeads(data)
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await getLeadStats(user.id)
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchQuery || 
      lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery)
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-gray-100'}`}>
        {statusConfig?.label || status}
      </span>
    )
  }

  const getStatusIcon = (status) => {
    const icons = {
      new: FiUser,
      contacted: FiMail,
      meeting_scheduled: FiCalendar,
      follow_up: FiClock,
      closed_won: FiCheckCircle,
      closed_lost: FiXCircle
    }
    return icons[status] || FiUser
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-polynesian-blue/70">Total Leads</p>
                <p className="text-2xl font-bold text-polynesian-blue">{stats.total || 0}</p>
              </div>
              <div className="p-3 rounded-full bg-picton-blue/10">
                <SafeIcon icon={FiUsers} className="w-6 h-6 text-picton-blue" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-polynesian-blue/70">New Leads</p>
                <p className="text-2xl font-bold text-polynesian-blue">{stats.new || 0}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <SafeIcon icon={FiUser} className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-polynesian-blue/70">Active Leads</p>
                <p className="text-2xl font-bold text-polynesian-blue">{stats.active || 0}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-polynesian-blue/70">Closed Won</p>
                <p className="text-2xl font-bold text-polynesian-blue">{stats.closed_won || 0}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <SafeIcon icon={FiCheckCircle} className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="text-gray-500 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <Button
            onClick={() => navigate('/dashboard/leads/new')}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Lead</span>
          </Button>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-polynesian-blue/70">
              {searchQuery || statusFilter !== 'all' ? 'No leads match your filters' : 'No leads yet'}
            </p>
            <p className="text-sm text-polynesian-blue/50 mt-1">
              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search criteria' : 'Add your first lead to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-anti-flash-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-anti-flash-white/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-picton-blue/10 mr-3">
                          <SafeIcon icon={getStatusIcon(lead.status)} className="w-4 h-4 text-picton-blue" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-polynesian-blue">
                            {lead.full_name}
                          </div>
                          {lead.notes && (
                            <div className="text-sm text-polynesian-blue/60 truncate max-w-xs">
                              {lead.notes.substring(0, 50)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {lead.email && (
                          <div className="flex items-center text-sm text-polynesian-blue/70">
                            <SafeIcon icon={FiMail} className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-xs">{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center text-sm text-polynesian-blue/70">
                            <SafeIcon icon={FiPhone} className="w-3 h-3 mr-1" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(lead.status)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-polynesian-blue/70">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/dashboard/leads/${lead.id}`}
                        className="text-picton-blue hover:text-picton-blue/80 transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default LeadsDashboard
