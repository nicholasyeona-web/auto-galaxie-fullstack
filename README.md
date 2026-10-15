# Auto Galaxie — Full-stack project

A car dealership app split into a React frontend and an Express backend.

## Structure

```
auto-galaxie-fullstack/
├── backend/     Express API (Node.js, .js)
└── frontend/    React app (Vite, .jsx)
```

## Features

- Search, filter (type/fuel) and sort in the catalogue
- Car detail pages with specs and related vehicles
- Favorites (wishlist), persisted server-side per account
- Compare up to 3 vehicles side by side (session-only, client-side)
- Cart with a live monthly-payment / financing calculator
- Simple account system (register/login, no password — demo only)
- Test-drive booking form, saved to your account

## Running it

**1. Backend** (http://localhost:4000)
```
cd backend
npm install
npm start          # or: npm run dev  (auto-restart with nodemon)
```
This creates `backend/store.json` on first run to persist users, favorites, cart and bookings.

**2. Frontend** (http://localhost:5173)
```
cd frontend
npm install
npm run dev
```
Open the printed local URL in your browser. The frontend expects the backend running on port 4000 (see `frontend/src/api.js` if you need to change that).

## Notes

- Authentication is intentionally minimal (email only, no password) — good enough for a demo, not for production.
- `store.json` is a flat JSON file acting as a database; swap in a real database for anything beyond local development.
