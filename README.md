# Prosperity Leaders Platform

Prosperity Leaders Platform is a React-based web application that helps families and professionals grow and manage their wealth. The project uses Vite for development tooling and integrates Supabase for the database, Clerk for authentication (handled entirely with the `@clerk/clerk-react` package), and Publit.io for file hosting.

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
- `VITE_CLERK_PUBLISHABLE_KEY`
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

## Clerk Setup

1. Create an account at [Clerk](https://clerk.com/) and create a new application.
2. Under API Keys, copy the **Publishable Key** and set `VITE_CLERK_PUBLISHABLE_KEY` in your `.env` file.
3. Configure allowed redirect URLs in the Clerk dashboard to include your local dev URL (e.g., `http://localhost:5173`).
4. Install the Clerk React SDK used for authentication and the core Clerk JS
   package. The Supabase client uses `getToken({ template: 'supabase' })`, so
   `@clerk/clerk-js` must also be installed:
   ```bash
   npm install @clerk/clerk-react@latest @clerk/clerk-js@latest
   ```
5. Enable the **Supabase** integration in the Clerk dashboard. This automatically
   adds the required `role: "authenticated"` claim to session tokens so the app
   can communicate with Supabase without manual JWT handling.

## Publit.io Setup

1. Register at [Publit.io](https://publit.io/) and create an API key.
2. Copy the **API Key** and **API Secret** into `VITE_PUBLITIO_PUBLIC_KEY` and `VITE_PUBLITIO_SECRET_KEY`.
3. Optional: configure default folders or permissions from the Publit.io dashboard according to your needs.

