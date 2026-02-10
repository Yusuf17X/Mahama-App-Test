# Mahama App Test - Monorepo

This repository contains both the frontend and backend for the Mahama App Test project.

## Project Structure

```
.
├── frontend/          # React/Vite frontend application (port 8080)
├── backend/           # Node/Express backend API (port 5000)
├── package.json       # Root package.json for monorepo scripts
└── README.md         # This file
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- MongoDB instance (local or remote)

### Initial Setup

1. **Install all dependencies** for both frontend and backend:
   ```bash
   npm run install:all
   ```

2. **Configure backend environment**:
   - Create `backend/config.env` file with required environment variables (MongoDB connection, etc.)
   - Refer to backend documentation for required variables

### Development

**Run both frontend and backend concurrently** with a single command:
```bash
npm run dev
```

This will start:
- Frontend development server at `http://localhost:8080`
- Backend API server at `http://localhost:5000`

### Individual Commands

If you need to run services separately:

- **Frontend only**:
  ```bash
  npm run dev:frontend
  ```

- **Backend only**:
  ```bash
  npm run dev:backend
  ```

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000/api/v1` by default.

You can override this by setting the `VITE_API_URL` environment variable in the frontend:
```bash
cd frontend
echo "VITE_API_URL=http://your-api-url" > .env
```

## Additional Information

- Frontend documentation: `frontend/README.md`
- Backend documentation: `backend/README.md`
- Backend test data seeder: `backend/dev-data/README.md`
