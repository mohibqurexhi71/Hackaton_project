# Hackathon Boilerplate

## Backend
cd backend
npm install
copy .env.example .env   # Windows CMD
# edit .env with your MongoDB Atlas URI and JWT_SECRET
npm run dev

Backend: http://localhost:5000

## Frontend
Open another terminal:
cd frontend
npm install
copy .env.example .env
npm run dev

Frontend: http://localhost:5173

## API
POST /api/auth/signup
POST /api/auth/login
GET /api/projects
POST /api/projects
GET /api/projects/:id
PUT /api/projects/:id
DELETE /api/projects/:id

Protected project routes require:
Authorization: Bearer <JWT>
