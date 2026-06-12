# Zepnest — Home Services Platform

A full-stack **Service Request Management Application** for homeowners to book and track home services (plumbing, electrical, cleaning, carpentry, and more).

---

## 🌐 Live Demo

| | URL |
|---|---|
| 🖥️ **Frontend (Live App)** | **https://zepnest.vercel.app** |
| ⚙️ **Backend API** | **https://zepnest-backend-yx7o.onrender.com** |
| 📖 **API Docs (Swagger)** | **https://zepnest-backend-yx7o.onrender.com/api/docs** |
| 💾 **Database** | PostgreSQL on Render (Oregon, US West) |
| 📦 **GitHub Repository** | **https://github.com/Phaneendra2005/zepnest** |

> ⚠️ **Note:** The backend is hosted on Render's free tier. It may take **30–60 seconds** to respond on the first visit after a period of inactivity (cold start). Subsequent requests will be fast.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| Backend | Node.js, Express.js, REST API |
| Database | PostgreSQL with Sequelize ORM |
| Auth | JWT (access token) + bcrypt |
| File Upload | Multer (local `/uploads` folder) |
| API Docs | Swagger UI at `/api/docs` |
| Logging | Winston + Morgan |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Database Hosting | Render PostgreSQL (Free tier) |

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MySQL 8 running locally (or PostgreSQL for production)

---

## Project Structure

```
zepnest/
├── backend/
│   ├── config/          # Database, Multer, Swagger configs
│   ├── controllers/     # authController, requestController
│   ├── middleware/      # auth, errorHandler, ownership, validate
│   ├── models/          # User, ServiceRequest, index (associations)
│   ├── routes/          # auth.js, requests.js
│   ├── utils/           # logger, response helpers
│   ├── uploads/         # Multer upload destination (gitignored)
│   ├── logs/            # Winston log files (gitignored)
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/         # axios.js, requests.js
│   │   ├── components/  # Navbar, PrivateRoute, RequestCard, StatusBadge, ...
│   │   ├── context/     # AuthContext
│   │   └── pages/       # Home, Login, Register, Dashboard, CreateRequest, RequestDetail
│   ├── index.html
│   └── vite.config.js
├── schema.sql
├── postman_collection.json
└── README.md
```

---

## Local Setup & Running

### 1. Clone the repository

```bash
git clone https://github.com/Phaneendra2005/zepnest.git
cd zepnest
```

### 2. Create the MySQL database

```bash
mysql -u root -p < schema.sql
```

This creates the `zepnest_db` database, all tables, and seed data.

### 3. Backend setup

```bash
cd backend
npm install

# Copy env template and fill in your values
cp .env.example .env
# Edit .env: set DB_USER, DB_PASSWORD, JWT_SECRET
```

**`.env` values to configure:**

| Variable | Description |
|---|---|
| `PORT` | API port (default: 5000) |
| `DB_HOST` | MySQL host |
| `DB_NAME` | Database name (`zepnest_db`) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `FRONTEND_URL` | CORS allowed origin |

```bash
npm run dev     # Development (nodemon)
npm start       # Production
```

API runs at **http://localhost:5000**
Swagger docs at **http://localhost:5000/api/docs**

### 4. Frontend setup

```bash
cd frontend
npm install

cp .env.example .env
# Set VITE_API_BASE_URL if needed (default: /api — proxied via Vite)

npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://zepnest.vercel.app |
| Backend | Render | https://zepnest-backend-yx7o.onrender.com |
| Database | Render PostgreSQL | Oregon (US West) |

### Environment Variables on Render (Backend)

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Render internal PostgreSQL URL |
| `JWT_SECRET` | Your secret key |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `https://zepnest.vercel.app` |

### Environment Variables on Vercel (Frontend)

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://zepnest-backend-yx7o.onrender.com/api` |

---

## API Summary

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user, returns JWT |
| POST | `/auth/login` | ❌ | Login, returns JWT |

### Service Requests — `/api/requests`

All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/requests` | List requests (paginated + searchable) |
| GET | `/requests/:id` | Get single request |
| POST | `/requests` | Create request (multipart/form-data) |
| PATCH | `/requests/:id/status` | Update status only |
| DELETE | `/requests/:id` | Delete request |

**Query parameters for `GET /requests`:**

| Param | Type | Description |
|---|---|---|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 10, max: 50) |
| `search` | string | Searches title, description, address |
| `status` | string | Filter by status enum value |

---

## Postman Collection

Import `postman_collection.json` into Postman.
The **Register** and **Login** requests automatically set the `token` collection variable.

Update the `baseUrl` variable to:
```
https://zepnest-backend-yx7o.onrender.com/api
```

---

## Screenshots

> _Add screenshots of: Home page, Login, Dashboard (grid view), Create Request form, Request Detail with status update_

---

## License

MIT
