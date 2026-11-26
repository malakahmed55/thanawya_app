# Thanaweya Results

A single-page web app where students look up their Thanaweya Amma (Egyptian high school) results by seating number or by name. Each result is shown on a card with a short message, and a confetti effect plays for passing results.

Live demo: https://thanawya-app.vercel.app

## Features
- Search by seating number (exact match) or by Arabic name (partial match, up to 20 results)
- Result card with a message based on the result
- Arabic, right-to-left interface
- Loading and "not found" messages

## Tech stack
- React and Vite
- Supabase (Postgres) as the data source, queried from the browser with the project's public (publishable) key
- canvas-confetti

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

Built by Malak Ahmed.
