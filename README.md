# Prosperity Leaders Platform

ProsperityOnline is a React-based web application for managing the Prosperity Leaders public website and attracting new leads. The back office equips agents with tools to manage leads, maintain professional profiles, embed booking calendars, deploy landing pages to recruit agents and clients, and track contacts through a simple CRM. Supabase powers the backend, database, and authentication, and Publit.io is used for file hosting. The project relies on Vite for development tooling.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Build and Preview

To generate the `dist/` directory for production, run:
```bash
npm run build
```
You can then preview the built files locally with:
```bash
npm run preview
```
Alternatively, serve the `dist/` directory with any static file server of your choice.

## Environment Variables

Create a `.env` file in the project root (or copy `.env.example`) and provide values for these variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PUBLITIO_PUBLIC_KEY`
- `VITE_PUBLITIO_SECRET_KEY`

If you see a console warning about unresolved Supabase variables, check that
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are defined in your `.env`
file before starting the app.

## Supabase Setup

1. Sign up at [Supabase](https://supabase.com/) and create a new project.
2. In the project settings, find the **Project URL** and **anon public** key and add them to `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Create the tables and functions required by the application (see `src/lib/supabase.js` for example RPC calls).
4. A working Supabase project is required for profile changes to be saved from the dashboard.


## Publit.io Setup

1. Register at [Publit.io](https://publit.io/) and create an API key.
2. Copy the **API Key** and **API Secret** into `VITE_PUBLITIO_PUBLIC_KEY` and `VITE_PUBLITIO_SECRET_KEY`.
3. Optional: configure default folders or permissions from the Publit.io dashboard according to your needs.

## Deployment

When deploying the app, make sure your hosting provider serves `index.html` for any unknown routes so the React Router `BrowserRouter` can handle client-side navigation. For static hosts like Netlify, add a file named `_redirects` to the `public/` directory containing:

```
/* /index.html 200
```

This rule redirects all requests to `index.html` allowing the router to resolve the path on the client.

