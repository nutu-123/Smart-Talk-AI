# Smart Talk AI

Multi-provider AI chat application with a Node.js/Express backend and a React (Create React App + Chakra UI) frontend. Supports multiple AI providers (Gemini, OpenAI, Cohere) with priority/fallback logic, user authentication (JWT + hashed passwords), persistent chat history (MongoDB), rate limiting, and a production-ready Docker Compose setup.

## Features
- Multi-provider AI orchestration (priority order + fallback)
- Secure authentication (JWT, bcrypt password hashing)
- Chat sessions & message persistence (MongoDB Atlas or local MongoDB)
- Email service (Gmail via Nodemailer) for notifications / future extensions
- Rate limiting & security headers (Helmet + express-rate-limit + CORS)
- Theming & responsive UI (Chakra UI + custom components)
- Suggested prompts & streaming message component (frontend)
- Ready for local dev OR containerized deployment (Docker Compose)

## Architecture
```
Root
 ├─ backend (Express API)
 │   ├─ services/ai/*  (Provider wrappers & manager)
 │   ├─ controllers/*  (Auth & Chat logic)
 │   ├─ models/*       (Mongoose schemas: User, Session, Message)
 │   ├─ routes/*       (REST endpoints: /api/auth, /api/chat, /api/test)
 │   ├─ middleware/*   (auth, rateLimiter)
 │   └─ config/*       (database, email)
 ├─ frontend (React SPA)
 │   ├─ src/components/* (UI + layout + chat widgets)
 │   ├─ src/context/*    (Auth, Chat, Theme providers)
 │   ├─ src/services/*   (api abstraction, auth/chat services)
 │   └─ src/hooks/*      (custom hooks)
 └─ docker-compose.yml (mongodb + backend + frontend services)
```

## Tech Stack
- Backend: Node.js, Express, Mongoose, JWT, Nodemailer
- Frontend: React 19, Chakra UI, React Router, Axios (or Fetch wrapper)
- Database: MongoDB (Atlas or local)
- AI Providers: Gemini, OpenAI, Cohere (env-configured)
- Security: Helmet, Rate Limiting, CORS
- Tooling: Nodemon (dev), Docker / Docker Compose

## Prerequisites
- Node.js >= 18 (recommended)
- npm >= 9
- MongoDB (local) OR MongoDB Atlas URI
- Docker & Docker Compose (optional for containerized run)

## Environment Variables (.env for backend)
Create `backend/.env` (never commit secrets). Example:
```
PORT=5000
JWT_SECRET=replace-with-strong-secret
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
COHERE_API_KEY=your-cohere-key
EMAIL_USER=your-gmail-address
EMAIL_PASSWORD=your-app-password-or-smtp-pass
MONGODB_URI=mongodb://localhost:27017/smarttalk-ai
```
> For Gmail, generate an App Password (not your normal account password) if 2FA is enabled.

## Local Development (Separate Terminals)
From PowerShell (Windows):
```powershell
# Backend
Push-Location "e:\projects\Smart-Talk-AI-main\Smart-Talk-AI-main\backend"
npm install
npm run dev

# Frontend (new terminal)
Push-Location "e:\projects\Smart-Talk-AI-main\Smart-Talk-AI-main\frontend"
npm install
npm start
```
Access:
- Frontend: http://localhost:3000
- API: http://localhost:5000/api

## Docker Compose (Unified Stack)
1. Ensure env variables are exported or placed in a `.env` (compose will read). For secrets, prefer Docker secrets or env files not committed.
2. Run:
```powershell
cd e:\projects\Smart-Talk-AI-main\Smart-Talk-AI-main
docker compose up --build
```
Services:
- MongoDB: port 27017
- Backend: http://localhost:5000
- Frontend (served via Nginx container): http://localhost:3000

## Key Backend Endpoints
| Method | Endpoint                  | Description                |
|--------|---------------------------|----------------------------|
| GET    | /api/test                 | Basic health test          |
| GET    | /api/test-ai              | AI provider test response  |
| POST   | /api/auth/signup          | Register new user          |
| POST   | /api/auth/signin          | Authenticate user (JWT)    |
| GET    | /api/chat/sessions        | List user chat sessions    |
| POST   | /api/chat/message         | Send chat message          |

(Exact payloads: inspect `backend/controllers/*.js` for request/response shapes.)

## AI Provider Strategy
`AIProviderManager.js` selects providers in priority order:
1. Gemini (default) → fallback chain
2. OpenAI
3. Cohere
If a provider fails or is unavailable (missing key), the next provider is attempted automatically.

## Security Notes
- Do NOT commit real API keys or secrets.
- Rotate keys periodically.
- Use long, random `JWT_SECRET` in production.
- Enable HTTPS & reverse proxy (e.g., Nginx / Azure / AWS) for production traffic.
- Consider adding request body size limits and audit logging for production.

## Troubleshooting
| Issue | Possible Cause | Fix |
|-------|----------------|-----|
| Email service error | Wrong Gmail creds / 2FA | Use App Password, verify `EMAIL_USER/EMAIL_PASSWORD` |
| MongoDB connection fails | Bad `MONGODB_URI` | Confirm URI & IP allowlist (Atlas) |
| CORS blocked | Origin not whitelisted | Update CORS origins in `server.js` |
| AI provider unavailable | Missing env key | Set provider key in `.env` |
| Frontend 404 to /api | Wrong base URL logic | Check `frontend/src/services/api.js` base URL function |

## Extending
- Add new AI provider: implement new Provider class in `services/ai`, register in manager order.
- Add chat features: update Mongoose schemas (e.g., metadata, tagging) then adapt controllers & frontend context.
- Production builds: run `npm run build` in frontend; serve static files behind Nginx or cloud hosting.

## License
MIT © 2025 Smart Talk AI Contributors

## Disclaimer
Sample configuration values in this README are placeholders. Replace with secure, unique secrets before deploying.

---
Need an `.env.example` file or deployment guide for cloud hosting next? Let me know and I can add it.
