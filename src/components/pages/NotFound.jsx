import React from 'react'
import { useNavigate } from 'react-router-dom'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiArrowLeft } = FiIcons

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-anti-flash-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-polynesian-blue mb-4">404 - Page Not Found</h1>
        <p className="text-polynesian-blue/70 mb-6">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-picton-blue hover:text-picton-blue/80 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  )
}

export default NotFound
