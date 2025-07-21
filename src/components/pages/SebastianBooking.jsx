import React from 'react'
import MainNav from '../layout/MainNav'

const SebastianBooking = () => {
  return (
    <div className="min-h-screen bg-anti-flash-white flex flex-col">
      <MainNav variant="public" />
      <div className="flex-1 flex flex-col items-center justify-start px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Meet with Sebastian</h1>
        <img
          src="https://media.publit.io/file/ProsperityWebApp/SebasJenny.jpg"
          alt="Sebastian"
          className="w-48 h-48 rounded-full mb-6 object-cover"
        />
        <div className="w-full max-w-3xl mb-6">
          <iframe
            frameBorder="0"
            width="100%"
            height="720"
            src="https://meet.brevo.com/sebasrod/borderless?l=zoom-meeting"
          ></iframe>
        </div>
        <p className="mb-4 text-center">
          If the calendar does not load, please click the button below to open it in a new tab.
        </p>
        <a
          href="https://meet.brevo.com/sebasrod"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-picton-blue text-white rounded-lg hover:bg-picton-blue/90"
        >
          Press here if the calendar does not load
        </a>
      </div>
    </div>
  )
}

export default SebastianBooking
