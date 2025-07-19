import React from 'react'
import { SignUp } from '@clerk/clerk-react'

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-anti-flash-white to-white">
      <SignUp routing="hash" path="/signup" signInUrl="/login" />
    </div>
  )
}

export default Signup
