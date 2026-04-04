# Frontend App

This frontend is a React + Vite dashboard built to exercise the backend submission through a usable UI.

## What It Includes

- seeded-role login experience
- dashboard summary cards and charts
- financial records listing and filtering
- admin-only record creation and editing
- admin-only user management
- role-aware navigation

## Environment

Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend to be running separately.

## Production Build

```bash
npm run build
```

## Deployment Note

For Render deployment, point the frontend to the deployed backend URL through `VITE_API_BASE_URL`.
