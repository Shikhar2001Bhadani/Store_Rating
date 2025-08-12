## Fullstack Store Rating

Full‑stack app for browsing stores and submitting star ratings. Users can register and rate, store owners can manage their listings and see ratings, and admins oversee users and stores.

### Tech Stack
- **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express, Sequelize, PostgreSQL
- **Auth**: JWT via HttpOnly cookies, role‑based access (admin, owner, user)

### Features
- **Auth**: Register, login, logout, current user (`/api/auth/me`)
- **Stores**: Public list/details; admin can create/update/delete; owners can view ratings of their stores
- **Ratings**: Authenticated users submit ratings; per‑user rating lookup; simple stats endpoint
- **Users**: Admin user management; users can update their password

---

## Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 13
- npm (or pnpm/yarn)

### Installation
```bash
# From repo root
cd backend && npm install
cd ../frontend && npm install
```

### Environment Variables

Create `backend/.env`:
```env
PORT=5000
DB_NAME=store_rating
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=change_this_in_prod
JWT_EXPIRES_IN=7d

# Frontend dev URL
FRONTEND_ORIGIN=http://localhost:5173
```

Create `frontend/.env`:
```env
VITE_API_BASE=http://localhost:5000/api
```

Create the database in PostgreSQL (name must match `DB_NAME`). The backend auto‑syncs models on start (Sequelize `sync({ alter: true })`).

### Run (Development)
```bash
# Terminal 1 – backend
cd backend
npm run dev

# Terminal 2 – frontend
cd frontend
npm run dev
```
- Frontend: `http://localhost:5173`
- API base: `http://localhost:5000/api`

### Seed Accounts
On first backend start, the server seeds:
- **Admin**: `admin@example.com` / `Admin@1234`
- **Owner**: `owner@example.com` / `Owner@1234`

These are logged in the backend console during startup.

---

## API Overview

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register` – `{ name, email, address, password, role? }`
- `POST /auth/login` – `{ email, password }`
- `POST /auth/logout`
- `GET /auth/me` – current user (requires auth)

### Stores
- `GET /stores` – list stores (public)
- `GET /stores/:id` – store details (public)
- `POST /stores` – create (admin only)
- `PUT /stores/:id` – update (admin only)
- `DELETE /stores/:id` – delete (admin only)
- `GET /stores/owner/me/ratings` – ratings for current owner’s stores (owner only)

### Ratings
- `POST /ratings` – create rating (auth). Body: `{ storeId, stars (1–5), comment? }`
- `GET /ratings/user/:storeId` – current user’s rating for a store (auth)
- `GET /ratings/stats/total` – basic stats (public)

### Users
- `GET /users` – list (admin only)
- `POST /users` – create by admin (admin only)
- `DELETE /users/:id` – delete (admin only)
- `PUT /users/password` – update own password (auth)
- `GET /users/:id` – details (roles: admin/owner/user)

Auth tokens are issued as HttpOnly cookies. The frontend Axios client is configured with `withCredentials: true` and the backend enables CORS with `credentials`.

---

## Scripts

### Backend (`backend/package.json`)
- `npm run dev` – start with nodemon
- `npm start` – start server

### Frontend (`frontend/package.json`)
- `npm run dev` – Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build

---

## Project Structure
```
fullstack-store-rating/
  backend/         # Express API, Sequelize models, routes, middleware
  frontend/        # React app (Vite), Redux Toolkit, Tailwind
```

---

## Notes
- If you see 401/CORS errors in dev, ensure `FRONTEND_ORIGIN` matches the frontend URL and that the frontend uses `VITE_API_BASE` pointing at the backend.
- For production, set a strong `JWT_SECRET` and configure proper CORS and HTTPS.

