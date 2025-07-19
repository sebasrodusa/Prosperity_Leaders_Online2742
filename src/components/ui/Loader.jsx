import React from 'react'

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-anti-flash-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
    </div>
  )
}

export default Loader