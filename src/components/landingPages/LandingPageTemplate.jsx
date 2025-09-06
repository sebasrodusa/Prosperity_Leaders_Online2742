import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'

const LandingPageTemplate = ({ template = {}, content = {}, professional = {}, onFormSubmit = () => {} }) => {
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      await onFormSubmit({
        ...formData,
        templateId: template.id,
        professionalId: professional.id,
        source: 'landing_page'
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormField = (field) => {
    const commonProps = {
      key: field.name,
      label: field.label,
      required: field.required,
      value: formData[field.name] || '',
      onChange: (e) => handleFormChange(field.name, e.target.value)
    }

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-polynesian-blue">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              {...commonProps}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
            >
              <option value="">Select an option...</option>
              {field.options.map((option, index) => (
                <option key={index} value={typeof option === 'string' ? option : option.value}>
                  {typeof option === 'string' ? option : option.label}
                </option>
              ))}
            </select>
          </div>
        )
      case 'textarea':
        return <Textarea {...commonProps} rows={4} />
      case 'tel':
        return <Input {...commonProps} type="tel" />
      case 'email':
        return <Input {...commonProps} type="email" />
      default:
        return <Input {...commonProps} type="text" />
    }
  }

  // Dynamic block-based rendering for builder previews
  if (Array.isArray(content.blocks)) {
    const renderBlock = (block, index) => {
      switch (block.type) {
        case 'header':
          return (
            <section key={index} className="py-8 text-center">
              <h1 className="text-3xl font-bold text-polynesian-blue">{block.title}</h1>
              {block.subtitle && (
                <p className="mt-2 text-polynesian-blue/70">{block.subtitle}</p>
              )}
            </section>
          )
        case 'hero':
          return (
            <section key={index} className="py-16 text-center bg-white">
              {block.image && (
                <img src={block.image} alt="" className="mx-auto mb-6 max-h-96 w-full object-cover" />
              )}
              <h1 className="text-4xl font-bold text-polynesian-blue mb-4">{block.headline}</h1>
              {block.subheadline && (
                <p className="text-xl text-polynesian-blue/70 mb-6">{block.subheadline}</p>
              )}
              {block.ctaText && (
                <Button onClick={() => window.open(block.ctaUrl || '#', '_blank')}>
                  {block.ctaText}
                </Button>
              )}
            </section>
          )
        case 'form':
          return (
            <section key={index} className="py-16 bg-gray-50">
              <Card className="max-w-md mx-auto p-8">
                <h3 className="text-xl font-semibold text-polynesian-blue mb-4">{block.title}</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  {block.fields?.map(renderFormField)}
                  <Button type="submit" disabled={submitting} className="w-full">
                    {block.submitText || 'Submit'}
                  </Button>
                </form>
              </Card>
            </section>
          )
        case 'testimonials':
          return (
            <section key={index} className="py-16 bg-gray-50">
              <div className="max-w-3xl mx-auto space-y-6">
                {block.items?.map((t, i) => (
                  <div key={i} className="p-6 bg-white rounded-lg shadow">
                    <p className="text-lg text-polynesian-blue/70 mb-2">{t.quote}</p>
                    <p className="font-semibold text-polynesian-blue">{t.author}</p>
                  </div>
                ))}
              </div>
            </section>
          )
        default:
          return null
      }
    }
    return <div>{content.blocks.map(renderBlock)}</div>
  }

  const renderForm = () => {
    if (submitted) {
      return (
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <SafeIcon icon={FiIcons.FiCheckCircle} className="w-8 h-8 text-green-600" />
          </motion.div>
          <h3 className="text-xl font-semibold text-polynesian-blue mb-2">
            ¡Gracias por tu interés!
          </h3>
          <p className="text-polynesian-blue/70">
            Nos pondremos en contacto contigo muy pronto.
          </p>
        </Card>
      )
    }

    return (
      <Card className="p-8">
        <h3 className="text-xl font-semibold text-polynesian-blue mb-6">
          {content.formConfig?.title || 'Contact Us'}
        </h3>
        
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {content.formConfig?.interestField && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-polynesian-blue">
                {content.formConfig.interestField.label}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.interest || ''}
                onChange={(e) => handleFormChange('interest', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
                required
              >
                <option value="">Selecciona una opción...</option>
                {content.formConfig.interestField.options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {content.formConfig?.fields?.map(renderFormField)}
          
          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? 'Enviando...' : content.formConfig?.submitButtonText || 'Submit'}
          </Button>
        </form>
      </Card>
    )
  }

  // Template-specific rendering logic
  switch (template.id) {
    case 'recruiting':
      return <RecruitingTemplate content={content} professional={professional} renderForm={renderForm} />
    case 'client':
      return <ClientTemplate content={content} professional={professional} renderForm={renderForm} />
    case 'hybrid':
      return <HybridTemplate content={content} professional={professional} renderForm={renderForm} />
    case 'latino_usa':
      return <LatinoUSATemplate content={content} professional={professional} renderForm={renderForm} />
    case 'international':
      return <InternationalTemplate content={content} professional={professional} renderForm={renderForm} />
    default:
      return <div>Template not found</div>
  }
}

// Individual template components
const RecruitingTemplate = ({ content, professional, renderForm }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
    {/* Hero Section */}
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-polynesian-blue mb-6">
              {content.headline}
            </h1>
            <p className="text-xl text-polynesian-blue/70 mb-8">
              {content.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => window.open(content.primaryCta?.url?.replace('{agentId}', professional.agent_id), '_blank')}
              >
                {content.primaryCta?.text}
              </Button>
              <Button variant="outline" size="lg">
                {content.secondaryCta?.text}
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img
              src={content.heroImage}
              alt="Join our team"
              className="w-full h-96 object-cover rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Why Join Us Section */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-12">
          {content.whyJoinUs?.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.whyJoinUs?.items?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiIcons[item.icon]} className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-polynesian-blue mb-3">
                {item.title}
              </h3>
              <p className="text-polynesian-blue/70">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Ideal Candidate Section */}
    <section className="py-16 bg-anti-flash-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-8">
          {content.idealCandidate?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-8">
          {content.idealCandidate?.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.idealCandidate?.qualities?.map((quality, index) => (
            <div key={index} className="flex items-center space-x-3">
              <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-polynesian-blue">{quality}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* What We Offer Section */}
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-12">
          {content.whatWeOffer?.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.whatWeOffer?.items?.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-polynesian-blue font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Next Steps Section */}
    <section className="py-16 bg-anti-flash-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-12">
          {content.nextSteps?.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.nextSteps?.steps?.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-polynesian-blue mb-3">
                {step.title}
              </h3>
              <p className="text-polynesian-blue/70">
                {step.description}
              </p>
              {index < content.nextSteps.steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-green-200 transform -translate-x-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Form Section */}
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        {renderForm()}
      </div>
    </section>
  </div>
)

const ClientTemplate = ({ content, professional, renderForm }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
    {/* Hero Section */}
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-polynesian-blue mb-6">
            {content.headline}
          </h1>
          <p className="text-xl text-polynesian-blue/70 mb-8 max-w-3xl mx-auto">
            {content.subheadline}
          </p>
          <img
            src={content.heroImage}
            alt="Financial Planning"
            className="w-full max-w-4xl mx-auto h-96 object-cover rounded-lg shadow-xl"
          />
        </motion.div>
      </div>
    </section>

    {/* What We Do Section */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-8">
          {content.whatWeDo?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-12 max-w-3xl mx-auto">
          {content.whatWeDo?.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.whatWeDo?.services?.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-blue-50 rounded-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiIcons[service.icon]} className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-polynesian-blue mb-3">
                {service.title}
              </h3>
              <p className="text-polynesian-blue/70">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section className="py-16 bg-anti-flash-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-4">
          {content.howItWorks?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-12">
          {content.howItWorks?.subtitle}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.howItWorks?.steps?.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-polynesian-blue mb-3">
                {step.title}
              </h3>
              <p className="text-polynesian-blue/70">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Who We Serve Section */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-8">
          {content.whoWeServe?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-12 max-w-3xl mx-auto">
          {content.whoWeServe?.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.whoWeServe?.segments?.map((segment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-blue-50 rounded-lg text-center"
            >
              <h3 className="text-lg font-semibold text-polynesian-blue mb-3">
                {segment.title}
              </h3>
              <p className="text-polynesian-blue/70 text-sm">
                {segment.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Form Section */}
    <section className="py-16 bg-anti-flash-white">
      <div className="max-w-2xl mx-auto px-4">
        {renderForm()}
      </div>
    </section>
  </div>
)

const HybridTemplate = ({ content, professional, renderForm }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
    {/* Hero Section */}
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-polynesian-blue mb-6">
            {content.headline}
          </h1>
          <p className="text-xl text-polynesian-blue/70 mb-8 max-w-3xl mx-auto">
            {content.subheadline}
          </p>
          <img
            src={content.heroImage}
            alt="Financial Growth"
            className="w-full max-w-4xl mx-auto h-96 object-cover rounded-lg shadow-xl"
          />
        </motion.div>
      </div>
    </section>

    {/* Intro Section */}
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-polynesian-blue mb-6">
          {content.intro?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70">
          {content.intro?.content}
        </p>
      </div>
    </section>

    {/* Split Section */}
    <section className="py-16 bg-anti-flash-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Client Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <h3 className="text-2xl font-bold text-polynesian-blue mb-4">
              {content.splitSection?.clientSide?.title}
            </h3>
            <p className="text-polynesian-blue/70 mb-6">
              {content.splitSection?.clientSide?.description}
            </p>
            <ul className="space-y-3 mb-8">
              {content.splitSection?.clientSide?.benefits?.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-polynesian-blue">{benefit}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full">
              {content.splitSection?.clientSide?.cta}
            </Button>
          </motion.div>

          {/* Career Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <h3 className="text-2xl font-bold text-polynesian-blue mb-4">
              {content.splitSection?.careerSide?.title}
            </h3>
            <p className="text-polynesian-blue/70 mb-6">
              {content.splitSection?.careerSide?.description}
            </p>
            <ul className="space-y-3 mb-8">
              {content.splitSection?.careerSide?.benefits?.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-polynesian-blue">{benefit}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">
              {content.splitSection?.careerSide?.cta}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Form Section */}
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        {renderForm()}
      </div>
    </section>
  </div>
)

const LatinoUSATemplate = ({ content, professional, renderForm }) => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
    {/* Hero Section */}
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-polynesian-blue mb-6">
              {content.headline}
            </h1>
            <p className="text-xl text-polynesian-blue/70 mb-8">
              {content.subheadline}
            </p>
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Solicitar Consulta Gratuita
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img
              src={content.heroImage}
              alt="Familia Latina"
              className="w-full h-96 object-cover rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Family Support Section */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-8">
          {content.familySupport?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-12 max-w-4xl mx-auto">
          {content.familySupport?.content}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.familySupport?.features?.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg"
            >
              <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <span className="text-polynesian-blue">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ITIN Planning Section */}
    <section className="py-16 bg-anti-flash-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-8">
          {content.itinPlanning?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-12 max-w-4xl mx-auto">
          {content.itinPlanning?.content}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.itinPlanning?.services?.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white rounded-lg shadow-sm"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiIcons[service.icon]} className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-polynesian-blue mb-3">
                {service.title}
              </h3>
              <p className="text-polynesian-blue/70 text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Career Opportunity Section */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-8">
          {content.careerOpportunity?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-12 max-w-4xl mx-auto">
          {content.careerOpportunity?.content}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.careerOpportunity?.benefits?.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg"
            >
              <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <span className="text-polynesian-blue">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Form Section */}
    <section className="py-16 bg-anti-flash-white">
      <div className="max-w-2xl mx-auto px-4">
        {renderForm()}
      </div>
    </section>
  </div>
)

const InternationalTemplate = ({ content, professional, renderForm }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
    {/* Hero Section */}
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-polynesian-blue mb-6">
            {content.headline}
          </h1>
          <p className="text-xl text-polynesian-blue/70 mb-8 max-w-4xl mx-auto">
            {content.subheadline}
          </p>
          <img
            src={content.heroImage}
            alt="Latinoamérica"
            className="w-full max-w-4xl mx-auto h-96 object-cover rounded-lg shadow-xl"
          />
        </motion.div>
      </div>
    </section>

    {/* Target Audience Section */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-8">
          {content.targetAudience?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-12 max-w-4xl mx-auto">
          {content.targetAudience?.content}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.targetAudience?.profiles?.map((profile, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-red-50 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-polynesian-blue mb-3">
                {profile.title}
              </h3>
              <p className="text-polynesian-blue/70">
                {profile.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* International Benefits Section */}
    <section className="py-16 bg-anti-flash-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-8">
          {content.internationalBenefits?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-12 max-w-4xl mx-auto">
          {content.internationalBenefits?.content}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.internationalBenefits?.benefits?.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white rounded-lg shadow-sm"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiIcons[benefit.icon]} className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-polynesian-blue mb-3">
                {benefit.title}
              </h3>
              <p className="text-polynesian-blue/70 text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Personalized Strategy Section */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-polynesian-blue text-center mb-8">
          {content.personalizedStrategy?.title}
        </h2>
        <p className="text-lg text-polynesian-blue/70 text-center mb-12 max-w-4xl mx-auto">
          {content.personalizedStrategy?.content}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {content.personalizedStrategy?.includes?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg"
            >
              <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-polynesian-blue">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Form Section */}
    <section className="py-16 bg-anti-flash-white">
      <div className="max-w-2xl mx-auto px-4">
        {renderForm()}
      </div>
    </section>
  </div>
)

export default LandingPageTemplate
