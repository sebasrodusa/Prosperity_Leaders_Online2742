// Landing Page Template Configurations
export const LANDING_PAGE_TEMPLATES = {
  recruiting: {
    id: 'recruiting',
    name: "We're Growing Our Team",
    description: 'Recruiting focused template',
    color: 'bg-green-500',
    defaultContent: {
      headline: "Join Our Award-Winning Financial Services Team",
      subheadline: "Build a career with unlimited earning potential while helping families secure their financial future.",
      heroImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      
      whyJoinUs: {
        title: "Why Join Us?",
        items: [
          {
            icon: "FiDollarSign",
            title: "Unlimited Commission",
            description: "Earn what you're worth with no income caps and performance bonuses."
          },
          {
            icon: "FiUsers",
            title: "Expert Mentorship",
            description: "Learn from industry veterans with proven track records."
          },
          {
            icon: "FiClock",
            title: "Flexible Schedule",
            description: "Work from home or office with flexible hours that fit your life."
          }
        ]
      },
      
      idealCandidate: {
        title: "Ideal Candidate Profile",
        description: "We're looking for motivated individuals who want to make a difference in people's financial lives.",
        qualities: [
          "Strong communication and interpersonal skills",
          "Desire to help families achieve financial security",
          "Self-motivated and goal-oriented",
          "Willing to learn and grow professionally",
          "Licensed or willing to obtain proper licensing"
        ]
      },
      
      whatWeOffer: {
        title: "What We Offer",
        items: [
          "Comprehensive training program",
          "Industry-leading compensation",
          "Advanced marketing tools and support",
          "Team collaboration and networking",
          "Career advancement opportunities",
          "Ongoing professional development"
        ]
      },
      
      nextSteps: {
        title: "Next Steps",
        steps: [
          {
            number: "1",
            title: "Apply Online",
            description: "Complete our simple application process"
          },
          {
            number: "2",
            title: "Initial Interview",
            description: "Meet with our team to discuss the opportunity"
          },
          {
            number: "3",
            title: "Start Your Journey",
            description: "Begin training and launch your new career"
          }
        ]
      },
      
      primaryCta: {
        text: "Apply Now",
        url: "https://www.mygficonnect.com/signup/?refid={agentId}"
      },
      
      secondaryCta: {
        text: "Request More Info",
        type: "form"
      },
      
      formConfig: {
        title: "Request Information",
        submitButtonText: "Request Information",
        fields: [
          { name: "name", label: "Full Name", type: "text", required: true },
          { name: "email", label: "Email Address", type: "email", required: true },
          { name: "phone", label: "Phone Number", type: "tel", required: true },
          { name: "experience", label: "Previous Experience", type: "select", options: [
            "No experience",
            "Some sales experience", 
            "Financial services experience",
            "Insurance experience"
          ]},
          { name: "message", label: "Questions or Comments", type: "textarea", required: false }
        ]
      }
    }
  },

  client: {
    id: 'client',
    name: "Your Financial Future Starts Here",
    description: 'Client-facing services template',
    color: 'bg-blue-500',
    defaultContent: {
      headline: "Your Financial Future Starts Here",
      subheadline: "Comprehensive financial solutions to protect, grow, and preserve your wealth for generations.",
      heroImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop",
      
      whatWeDo: {
        title: "What We Do",
        description: "We specialize in helping families and individuals build lasting financial security through proven strategies.",
        services: [
          {
            icon: "FiShield",
            title: "Life Insurance",
            description: "Protect your family's financial future with comprehensive coverage options."
          },
          {
            icon: "FiTrendingUp",
            title: "Indexed Universal Life (IUL)",
            description: "Build cash value while protecting your family with market-linked growth potential."
          },
          {
            icon: "FiPieChart",
            title: "Annuities",
            description: "Secure retirement income with guaranteed growth and protection strategies."
          },
          {
            icon: "FiBookOpen",
            title: "College Planning",
            description: "Tax-advantaged strategies to fund your children's education expenses."
          }
        ]
      },
      
      howItWorks: {
        title: "How It Works",
        subtitle: "Our proven 3-step process to financial security",
        steps: [
          {
            number: "1",
            title: "Discovery",
            description: "We learn about your goals, concerns, and current financial situation."
          },
          {
            number: "2",
            title: "Strategy",
            description: "We create a personalized plan tailored to your unique needs and objectives."
          },
          {
            number: "3",
            title: "Implementation",
            description: "We help you implement your plan and provide ongoing support and guidance."
          }
        ]
      },
      
      whoWeServe: {
        title: "Who We Serve",
        description: "We work with individuals and families at every stage of their financial journey.",
        segments: [
          {
            title: "Young Families",
            description: "Starting to build wealth while protecting growing families"
          },
          {
            title: "Business Owners",
            description: "Entrepreneurs seeking tax-efficient wealth building strategies"
          },
          {
            title: "Pre-Retirees",
            description: "Individuals preparing for a secure and comfortable retirement"
          },
          {
            title: "High Net Worth",
            description: "Affluent families focused on wealth preservation and transfer"
          }
        ]
      },
      
      primaryCta: {
        text: "Book a Free Consultation",
        type: "calendly"
      },
      
      formConfig: {
        title: "Schedule Your Free Consultation",
        submitButtonText: "Schedule Consultation",
        fields: [
          { name: "name", label: "Full Name", type: "text", required: true },
          { name: "email", label: "Email Address", type: "email", required: true },
          { name: "phone", label: "Phone Number", type: "tel", required: true },
          { name: "interest", label: "Primary Interest", type: "select", options: [
            "Life Insurance",
            "Retirement Planning",
            "College Planning",
            "Business Planning",
            "Estate Planning",
            "General Financial Planning"
          ]},
          { name: "timeline", label: "Timeline", type: "select", options: [
            "Immediately",
            "Within 1 month",
            "Within 3 months",
            "Within 6 months",
            "Just exploring options"
          ]}
        ]
      }
    }
  },

  hybrid: {
    id: 'hybrid',
    name: "Standard Hybrid",
    description: 'Combined recruiting and client template',
    color: 'bg-purple-500',
    defaultContent: {
      headline: "Let's Grow Your Future — Financially and Professionally",
      subheadline: "Whether you're looking to secure your family's financial future or build a rewarding career in financial services, we're here to help.",
      heroImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop",
      
      intro: {
        title: "Two Paths to Prosperity",
        content: "At Prosperity Leaders™, we believe everyone deserves the opportunity to achieve financial freedom. Whether you're seeking professional financial guidance or looking to start a career helping others with their finances, we have the right path for you."
      },
      
      splitSection: {
        clientSide: {
          title: "Looking for a Financial Plan?",
          description: "Secure your family's future with proven strategies for wealth building, protection, and preservation.",
          benefits: [
            "Personalized financial strategies",
            "Life insurance and protection planning",
            "Retirement and college planning",
            "Tax-efficient wealth building"
          ],
          cta: "Get Your Free Consultation"
        },
        careerSide: {
          title: "Want a New Career?",
          description: "Join our team and help families while building unlimited income potential in the financial services industry.",
          benefits: [
            "Unlimited earning potential",
            "Comprehensive training program",
            "Flexible work environment",
            "Make a difference in people's lives"
          ],
          cta: "Explore Career Opportunities"
        }
      },
      
      formConfig: {
        title: "Get Started Today",
        submitButtonText: "Submit Request",
        interestField: {
          label: "I'm interested in...",
          options: [
            { value: "planning", label: "Starting a Financial Plan" },
            { value: "career", label: "Joining the Team" },
            { value: "both", label: "Both Options" }
          ]
        },
        fields: [
          { name: "name", label: "Full Name", type: "text", required: true },
          { name: "email", label: "Email Address", type: "email", required: true },
          { name: "phone", label: "Phone Number", type: "tel", required: true },
          { name: "message", label: "Tell us more about your goals", type: "textarea", required: false }
        ]
      }
    }
  },

  latino_usa: {
    id: 'latino_usa',
    name: "Latinos en EE.UU.",
    description: 'Spanish template focused on ITIN and Latino community',
    color: 'bg-orange-500',
    defaultContent: {
      headline: "Oportunidades Financieras para Latinos en EE.UU.",
      subheadline: "Construye un futuro próspero para tu familia con estrategias financieras diseñadas para la comunidad latina.",
      heroImage: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=600&fit=crop",
      
      familySupport: {
        title: "Apoya a tu familia, sin importar tu estatus migratorio",
        content: "Entendemos los desafíos únicos que enfrentan las familias latinas en Estados Unidos. Nuestros servicios están diseñados para ayudarte a construir seguridad financiera sin importar tu situación migratoria.",
        features: [
          "Planes de seguro de vida sin verificación de estatus",
          "Estrategias de ahorro y protección familiar",
          "Consultas en español con profesionales bilingües",
          "Planificación para el envío de remesas"
        ]
      },
      
      itinPlanning: {
        title: "Planes financieros con ITIN disponibles",
        content: "No necesitas un número de Seguro Social para comenzar a planificar tu futuro financiero. Trabajamos con individuos que tienen ITIN para crear estrategias efectivas.",
        services: [
          {
            icon: "FiShield",
            title: "Seguros de Vida",
            description: "Protección para tu familia con opciones flexibles de pago"
          },
          {
            icon: "FiHome",
            title: "Planificación Familiar",
            description: "Estrategias para comprar casa y construir patrimonio"
          },
          {
            icon: "FiBookOpen",
            title: "Educación de los Hijos",
            description: "Planes de ahorro para la universidad de tus hijos"
          },
          {
            icon: "FiDollarSign",
            title: "Remesas Inteligentes",
            description: "Optimiza el envío de dinero a tu país de origen"
          }
        ]
      },
      
      careerOpportunity: {
        title: "¿Quieres trabajar con nosotros?",
        content: "Únete a nuestro equipo y ayuda a familias latinas mientras construyes una carrera próspera en servicios financieros.",
        benefits: [
          "Entrenamiento completo en español",
          "Potencial de ingresos ilimitado",
          "Horarios flexibles para equilibrar familia y trabajo",
          "Apoyo continuo de nuestro equipo experimentado"
        ]
      },
      
      formConfig: {
        title: "Solicita Tu Consulta Gratuita",
        submitButtonText: "Solicitar Información",
        fields: [
          { name: "nombre", label: "Nombre Completo", type: "text", required: true },
          { name: "email", label: "Correo Electrónico", type: "email", required: true },
          { name: "telefono", label: "Número de Teléfono", type: "tel", required: true },
          { name: "interes", label: "Estoy interesado en...", type: "select", options: [
            "Seguro de vida",
            "Planificación financiera",
            "Oportunidad de carrera",
            "Información general"
          ]},
          { name: "mensaje", label: "Cuéntanos sobre tus metas", type: "textarea", required: false }
        ]
      }
    }
  },

  international: {
    id: 'international',
    name: "Latinoamérica",
    description: 'Spanish template for Latin America international clients',
    color: 'bg-red-500',
    defaultContent: {
      headline: "Lidera tu Futuro Financiero desde América Latina",
      subheadline: "Accede a oportunidades internacionales de carrera y planificación financiera en dólares desde cualquier país de Latinoamérica.",
      heroImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      
      targetAudience: {
        title: "¿Para quién es esto?",
        content: "Esta oportunidad está diseñada para profesionales y emprendedores latinoamericanos que buscan diversificar sus ingresos y proteger su patrimonio en dólares.",
        profiles: [
          {
            title: "Profesionales Independientes",
            description: "Consultores, freelancers y profesionales que buscan ingresos adicionales"
          },
          {
            title: "Emprendedores",
            description: "Dueños de negocios que quieren diversificar sus fuentes de ingreso"
          },
          {
            title: "Familias con Visión Global",
            description: "Familias que buscan proteger su patrimonio en moneda fuerte"
          }
        ]
      },
      
      internationalBenefits: {
        title: "Beneficios de trabajar con una compañía internacional",
        content: "Aprovecha las ventajas de trabajar con una empresa estadounidense desde tu país de residencia.",
        benefits: [
          {
            icon: "FiGlobe",
            title: "Trabajo 100% Remoto",
            description: "Trabaja desde cualquier lugar con conexión a internet"
          },
          {
            icon: "FiDollarSign",
            title: "Ingresos en Dólares",
            description: "Genera ingresos en moneda fuerte para protegerte de la inflación"
          },
          {
            icon: "FiUsers",
            title: "Red Internacional",
            description: "Conecta con profesionales de toda América Latina"
          },
          {
            icon: "FiTrendingUp",
            title: "Crecimiento Profesional",
            description: "Desarrolla habilidades valoradas en el mercado internacional"
          }
        ]
      },
      
      personalizedStrategy: {
        title: "Solicita tu estrategia financiera personalizada",
        content: "Nuestros expertos crearán un plan adaptado a tu situación específica y los desafíos económicos de tu país.",
        includes: [
          "Análisis de tu situación financiera actual",
          "Estrategias de protección contra inflación",
          "Planificación de ingresos en dólares",
          "Opciones de inversión internacional",
          "Plan de acción paso a paso"
        ]
      },
      
      formConfig: {
        title: "Comienza Tu Transformación Financiera",
        submitButtonText: "Solicitar Información",
        interestField: {
          label: "Me interesa...",
          options: [
            { value: "carrera", label: "Quiero trabajar con ustedes" },
            { value: "estrategia", label: "Quiero una estrategia financiera" },
            { value: "ambas", label: "Ambas opciones" }
          ]
        },
        fields: [
          { name: "nombre", label: "Nombre Completo", type: "text", required: true },
          { name: "email", label: "Correo Electrónico", type: "email", required: true },
          { name: "telefono", label: "Número de Teléfono (con código de país)", type: "tel", required: true },
          { name: "pais", label: "País de Residencia", type: "select", options: [
            "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", 
            "Costa Rica", "Ecuador", "El Salvador", "Guatemala", 
            "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", 
            "Perú", "República Dominicana", "Uruguay", "Venezuela", "Otro"
          ]},
          { name: "experiencia", label: "Experiencia Profesional", type: "select", options: [
            "Empleado",
            "Profesional independiente",
            "Emprendedor/Empresario",
            "Estudiante",
            "Otro"
          ]},
          { name: "mensaje", label: "Cuéntanos sobre tus objetivos", type: "textarea", required: false }
        ]
      }
    }
  }
}

export const getTemplateById = (templateId) => {
  return LANDING_PAGE_TEMPLATES[templateId] || null
}

export const getAllTemplates = () => {
  return Object.values(LANDING_PAGE_TEMPLATES)
}