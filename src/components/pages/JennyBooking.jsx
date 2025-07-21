import React from 'react'
import MainNav from '../layout/MainNav'

const JennyBooking = () => {
  return (
    <div className="min-h-screen bg-anti-flash-white">
      <MainNav variant="public" />
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Meet with Jenny</h1>
        <img
          src="https://media.publit.io/file/ProsperityWebApp/SebasJenny.jpg"
          alt="Jenny profile"
          className="mx-auto w-40 h-40 rounded-full object-cover mb-8 shadow-lg"
        />
        <div className="w-full mb-6">
          <iframe
            frameBorder="0"
            width="100%"
            height="720"
            src="https://meet.brevo.com/jennyrodmin/borderless?l=zoom-meeting"
          ></iframe>
        </div>
        <p className="mb-4">If the calendar does not load,</p>
        <a
          href="https://meet.brevo.com/jennyrodmin"
          className="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Press here
        </a>
      </div>
    </div>
  )
}

export default JennyBooking
