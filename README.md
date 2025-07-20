# Prosperity Leaders Platform

Prosperity Leaders Platform is a React-based web application that helps families and professionals grow and manage their wealth. The project uses Vite for development tooling and integrates Supabase for the database, Clerk for authentication, and Publit.io for file hosting.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the project root (or copy `.env.example`) and provide values for these variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_PUBLITIO_PUBLIC_KEY`
- `VITE_PUBLITIO_SECRET_KEY`

## Supabase Setup

1. Sign up at [Supabase](https://supabase.com/) and create a new project.
2. In the project settings, find the **Project URL** and **anon public** key and add them to `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Create the tables and functions required by the application (see `src/lib/supabase.js` for example RPC calls).
4. A working Supabase project is required for profile changes to be saved from the dashboard.

## Clerk Setup

1. Create an account at [Clerk](https://clerk.com/) and create a new application.
2. Under API Keys, copy the **Publishable Key** and set `VITE_CLERK_PUBLISHABLE_KEY` in your `.env` file.
3. Configure allowed redirect URLs in the Clerk dashboard to include your local dev URL (e.g., `http://localhost:5173`).

## Publit.io Setup

1. Register at [Publit.io](https://publit.io/) and create an API key.
2. Copy the **API Key** and **API Secret** into `VITE_PUBLITIO_PUBLIC_KEY` and `VITE_PUBLITIO_SECRET_KEY`.
3. Optional: configure default folders or permissions from the Publit.io dashboard according to your needs.

