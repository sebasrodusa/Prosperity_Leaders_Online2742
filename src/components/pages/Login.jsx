import React, { useEffect } from 'react'

const Login = () => {
  useEffect(() => {
    window.location.href =
      'https://accounts.prosperityleaders.net/sign-in?redirect_url=https://prosperityleaders.net/#/dashboard'
  }, [])

  return null
}

export default Login
