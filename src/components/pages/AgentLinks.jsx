import React from 'react'
import MainNav from '../layout/MainNav'

const agentLinks = [
  { title: 'GFI Rocket Retirement Report: prosperity', url: 'https://shor.by/UHHT' },
  { title: 'SureLC™: GFI Agents Appointment & Contracting', url: 'https://shor.by/UmwL' },
  { title: 'Ethos Agent Dashboard', url: 'https://shor.by/I8XZ' },
  { title: 'WinFlex Web - Register & Login: All Illustrations', url: 'https://shor.by/4GhQ' },
  { title: 'American National Life (Anico) – Available in NY', url: 'https://shor.by/aYbi' },
  { title: 'Mutual of Omaha for GFI – Available in NY', url: 'https://shor.by/lZbe' },
  { title: 'More Questions? - ¿Mas Preguntas? (Clave: prosperity)', url: 'https://shor.by/Vdzp' },
  { title: 'Calculator to Compare 401K Retirement Fees', url: 'https://shor.by/XP9c' },
  { title: 'Corbridge QOL Rapid Rater: Life Quotes & Illustrations', url: 'https://shor.by/GeJ1' },
  { title: 'Corebridge Financial Connext Site (Register to submit igo)', url: 'https://shor.by/8qoB' },
  { title: 'SuccessCE: AML, Licensed Agent Trainings and Continuing Education', url: 'https://shor.by/7rPU' },
  { title: 'SILAC Microsite | Annuities', url: 'https://shor.by/nFim' }
]

const AgentLinks = () => {
  return (
    <div className="min-h-screen bg-anti-flash-white">
      <MainNav variant="public" />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-center mb-8">Agent Resources</h1>
        <div className="max-w-2xl mx-auto space-y-4">
          {agentLinks.map(link => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-picton-blue text-white py-3 px-4 rounded-lg text-center hover:bg-picton-blue/90"
            >
              {link.title}
            </a>
          ))}
          <a
            href="https://shor.by/prosper"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-accent-teal text-white py-3 px-4 rounded-lg text-center hover:bg-accent-teal/90"
          >
            shor.by/prosper
          </a>
        </div>
      </div>
    </div>
  )
}

export default AgentLinks

