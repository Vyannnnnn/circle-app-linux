# Circle App Linux

Circle App Linux is a full-stack social platform built with a modern **React + Vite** frontend and a **TypeScript-based Express** backend. It supports core social features such as authentication, thread creation, likes, replies, follows, profile views, and real-time notifications via WebSocket.

## ✨ Features

- 🔐 User authentication and authorization
- 📝 Thread creation and interaction
- ❤️ Likes and nested replies
- 👥 Follow/unfollow users
- 👤 Profile viewing and social graph features
- 🔔 Real-time notifications over WebSocket
- ⚙️ End-to-end TypeScript codebase

## 🧱 Tech Stack

### Frontend
- React
- Vite
- TypeScript

### Backend
- Node.js
- Express
- TypeScript
- WebSocket (real-time notifications)

## 📁 Project Structure

```text
circle-app-linux/
├── client/         # React + Vite frontend
├── server/         # Express + TypeScript backend
├── shared/         # Shared types/utilities (if applicable)
└── README.md
```

> If your actual folder names differ, update the structure section accordingly.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (or pnpm/yarn)

### 1) Clone the repository

```bash
git clone https://github.com/Vyannnnnn/circle-app-linux.git
cd circle-app-linux
```

### 2) Install dependencies

If frontend and backend are separated:

```bash
# frontend
cd client
npm install

# backend
cd ../server
npm install
```

If using a single root package:

```bash
npm install
```

### 3) Configure environment variables

Create `.env` files as needed (example):

```env
# server/.env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
WS_ORIGIN=http://localhost:5173
```

```env
# client/.env
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

## ▶️ Running the App

### Development mode

```bash
# backend
cd server
npm run dev
```

```bash
# frontend (new terminal)
cd client
npm run dev
```

### Production build

```bash
# frontend build
cd client
npm run build
```

```bash
# backend build/start
cd server
npm run build
npm run start
```

## 🔌 API & Real-Time Notes

- REST API handles authentication, threads, replies, likes, follows, and profile actions.
- WebSocket channel is used for pushing real-time notifications to connected clients.

## ✅ Suggested Scripts

Typical scripts you may expose in `package.json`:

- `dev` – run in development mode
- `build` – compile TypeScript/build frontend
- `start` – run production server
- `lint` – run linter
- `test` – run tests

## 🛡️ Security & Best Practices

- Store secrets in `.env` (never commit them)
- Use secure JWT/session handling and token expiration
- Validate/sanitize all incoming payloads
- Enable CORS with explicit origins
- Apply rate limiting for auth and write endpoints

## 📌 Roadmap Ideas

- Direct messaging
- Media uploads (images/videos)
- Notification preferences
- Search and hashtags
- Admin moderation tools
- Dockerized deployment





---

Built with TypeScript, designed for scalable social interactions.
