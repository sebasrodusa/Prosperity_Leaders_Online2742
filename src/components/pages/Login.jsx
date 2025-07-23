import React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'

const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-anti-flash-white to-white">
    <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} view="sign_in" />
  </div>
)

export default Login
