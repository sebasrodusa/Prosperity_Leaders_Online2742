import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { supabase, createUser } from '../../lib/supabase'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import MultiSelect from '../ui/MultiSelect'
import { SERVICE_OPTIONS } from '../../lib/directory'

const EnhancedSignup = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [languages, setLanguages] = useState([])
  const [servicesOffered, setServicesOffered] = useState([])

  const LANGUAGE_OPTIONS = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'Mandarin', label: 'Mandarin' },
    { value: 'French', label: 'French' }
  ]
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors }
  } = useForm()

  const role = watch('role')

  const nextStep = async () => {
    let fields = []
    if (step === 1) fields = ['role']
    if (step === 2) fields = ['firstName', 'lastName', 'email', 'phone']
    if (step === 3) fields = ['password', 'confirmPassword']
    if (step === 4 && role === 'advisor') fields = ['username', 'title', 'city', 'state']
    if (step === 5 && role === 'advisor') fields = ['agentCode', 'team']

    const valid = await trigger(fields)
    if (!valid) return

    if (step === 3 && role !== 'advisor') {
      setStep(6)
    } else if (step === 4 && role !== 'advisor') {
      setStep(6)
    } else {
      setStep(step + 1)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { role: role } }
      })
      if (error) throw error
      const user = signUpData.user
      if (user) {
        await createUser({
          id: user.id,
          role,
          first_name: data.firstName,
          last_name: data.lastName,
          full_name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone || null,
          username: role === 'advisor' ? data.username : null,
          title: role === 'advisor' ? data.title : null,
          city: role === 'advisor' ? data.city : null,
          state: role === 'advisor' ? data.state : null,
          agent_id: role === 'advisor' ? data.agentCode : null,
          team: role === 'advisor' ? data.team : null,
          languages: role === 'advisor' ? languages.map(l => l.value) : null,
          services_offered: role === 'advisor' ? servicesOffered.map(s => s.value) : null
        })
      }
      alert('Signup successful! Please check your email to confirm your account.')
      navigate('/login')
    } catch (err) {
      console.error('Signup error:', err)
      alert(err.message || 'Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-anti-flash-white to-white p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md space-y-6 w-full max-w-lg">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-polynesian-blue">Select Your Role</h2>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input type="radio" value="advisor" {...register('role', { required: 'Role is required' })} />
                <span>Advisor</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" value="client" {...register('role', { required: 'Role is required' })} />
                <span>Client</span>
              </label>
            </div>
            {errors.role && <p className="text-sm text-status-error">{errors.role.message}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input label="First Name" error={errors.firstName?.message} required {...register('firstName', { required: 'First name is required' })} />
            <Input label="Last Name" error={errors.lastName?.message} required {...register('lastName', { required: 'Last name is required' })} />
            <Input label="Email" type="email" error={errors.email?.message} required {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} />
            <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Input label="Password" type="password" error={errors.password?.message} required {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
            <Input label="Confirm Password" type="password" error={errors.confirmPassword?.message} required {...register('confirmPassword', { required: 'Confirm your password', validate: value => value === watch('password') || 'Passwords do not match' })} />
          </div>
        )}

        {step === 4 && role === 'advisor' && (
          <div className="space-y-4">
            <Input label="Username" error={errors.username?.message} required {...register('username', { required: 'Username is required' })} />
            <Input label="Title" error={errors.title?.message} {...register('title')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="City" error={errors.city?.message} {...register('city')} />
              <Input label="State" error={errors.state?.message} {...register('state')} />
            </div>
          </div>
        )}

        {step === 5 && role === 'advisor' && (
          <div className="space-y-4">
            <Input label="Agent Code" error={errors.agentCode?.message} {...register('agentCode')} />
            <Input label="Team" error={errors.team?.message} {...register('team')} />
            <MultiSelect
              label="Services Offered"
              options={SERVICE_OPTIONS}
              value={servicesOffered}
              onChange={setServicesOffered}
            />
            <MultiSelect
              label="Languages Spoken"
              options={LANGUAGE_OPTIONS}
              value={languages}
              onChange={setLanguages}
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <Textarea label="Terms" readOnly value="By signing up you agree to our terms and conditions." />
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('terms', { required: 'You must agree to the terms' })} />
              <span>I agree to the terms</span>
            </label>
            {errors.terms && <p className="text-sm text-status-error">{errors.terms.message}</p>}
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 6 && (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          )}
          {step === 6 && (
            <Button type="submit" loading={submitting}>
              Sign Up
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default EnhancedSignup
