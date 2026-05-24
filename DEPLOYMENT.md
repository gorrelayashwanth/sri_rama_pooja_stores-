# Sri Rama Pooja Store Deployment Notes

## Local URLs

- Frontend: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin`
- API: `http://localhost:5000/api/v1`
- API health check: `http://localhost:5000/api/v1/health`

## Frontend Deployment

The frontend is now ready for static deployment on:

- Vercel
- Cloudflare Pages

Files added for SPA routing:

- `frontend/vercel.json`
- `frontend/public/_redirects`

Environment variable (optional on Vercel monorepo):

- `VITE_API_URL=https://your-backend-domain/api/v1`
- If unset in production, the frontend defaults to `/_/backend/api/v1` (same-origin Vercel backend route).

## Backend Deployment

The backend is an Express + Prisma server, so it should be deployed as a Node service.

Recommended platforms:

- Railway
- Render
- Fly.io
- Google Cloud Run
- VPS / traditional Node hosting

Useful commands:

- `npm run build`
- `npm start`

Environment variables are documented in:

- `backend/.env.example`

## Database Status

Current database stack:

- Prisma
- PostgreSQL

## Firebase Readiness

The frontend now talks to the backend through regular REST API calls and no longer depends on Supabase realtime for the admin orders page.

That makes Firebase migration easier later because you can choose either:

- Keep the frontend as-is and replace the backend API with Firebase Functions / Firestore logic
- Or keep the Node backend and migrate only the database layer

## Maps

The storefront now uses a real embedded Google Map plus working Google Maps directions links without needing a Maps API key.

If you later want:

- branded map styling
- nearby landmarks
- autocomplete search
- advanced route planning

then a Google Maps API key can be added on top of the current setup.
