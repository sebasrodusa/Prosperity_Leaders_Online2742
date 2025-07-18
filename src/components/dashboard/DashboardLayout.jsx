import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MainNav from '../layout/MainNav'

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-anti-flash-white">
      <MainNav variant="dashboard" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout