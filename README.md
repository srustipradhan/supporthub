# SupportHub Platform

Full-stack support ticket and conversation platform with NestJS backend, Next.js admin dashboard, and Flutter mobile app.

## Project Structure

```
supporthub/
├── backend/          # NestJS API + Socket.IO
├── admin/            # Next.js Admin Dashboard
└── mobile/supporthub_app/  # Flutter User App
```

## Prerequisites

- Node.js 18+
- PostgreSQL
- Flutter 3.12+ (for mobile)
- Firebase project (optional, for push notifications)

## Quick Start

### 1. Database

**Local:** Create a PostgreSQL database named `supporthub`.

**Neon (cloud):** Copy the connection string from the Neon console into `backend/.env`:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require
```

When `DATABASE_URL` is set, `DB_HOST` / `DB_*` are ignored.

### 2. Backend

```bash
cd backend
cp .env.example .env   # or edit existing .env
npm install
npm run seed           # Creates admin user
npm run start:dev
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
- Default admin: `admin@supporthub.com` / `Admin@123`

### 3. Admin Dashboard

```bash
cd admin
cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 (Next.js default port 3000 — change admin port if backend uses 3000):

```bash
npm run dev -- -p 3001
```

Update `.env.local` if needed.

**Vercel / production:** Without `.env.local`, production builds use `https://supporthub-th9v.onrender.com` automatically. You can override with `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` in the Vercel dashboard (redeploy after changing).

### 4. Flutter App

```bash
cd mobile/supporthub_app
flutter pub get
flutter run
```

**API URL for emulators:**
- Android emulator: `http://10.0.2.2:3000` (default in `app_config.dart`)
- iOS simulator: use `--dart-define=API_URL=http://localhost:3000`
- Physical device: use your machine's LAN IP

```bash
flutter run --dart-define=API_URL=http://192.168.1.x:3000 --dart-define=WS_URL=http://192.168.1.x:3000
```

### Firebase (Push Notifications)

1. Create a Firebase project
2. Add Android/iOS apps
3. Place `google-services.json` in `android/app/`
4. Configure iOS with `GoogleService-Info.plist`

Notifications gracefully skip if Firebase is not configured.

## API Overview

| Module | Endpoints |
|--------|-----------|
| Auth | POST `/auth/register`, POST `/auth/login` |
| Tickets | POST `/tickets`, GET `/tickets/my`, GET `/tickets`, GET `/tickets/:id`, PATCH close/reopen |
| Messages | POST `/messages`, GET `/messages/ticket/:ticketId` |
| Dashboard | GET `/dashboard/stats` (Admin) |

## WebSocket (Socket.IO)

Namespace: `/chat`

| Event | Description |
|-------|-------------|
| `join_ticket` | Join room `{ ticketId }` |
| `send_message` | Send `{ ticketId, content }` |
| `new_message` | Receive broadcast message |

Auth: pass JWT via `auth.token` on connect.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | NestJS, TypeORM, PostgreSQL, JWT, bcrypt, Socket.IO, Swagger |
| Admin | Next.js 16, TypeScript, TailwindCSS, Axios, Socket.IO Client |
| Mobile | Flutter, Provider, Dio, Socket.IO, Firebase Messaging, Material 3 |
