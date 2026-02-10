# Frontend-Backend Integration Testing Guide

## Overview
This document provides guidance on testing the frontend-backend integration after connecting all API endpoints.

## Prerequisites

### Backend Setup
1. MongoDB database (local or remote)
2. Backend environment configuration

Create `backend/config.env`:
```env
NODE_ENV=development
PORT=5000
DB=mongodb+srv://username:<DATABASE_PASSWORD>@cluster.mongodb.net/mahama-app?retryWrites=true&w=majority
DATABASE_PASSWORD=your_password_here
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

### Installation
```bash
# Install all dependencies
npm run install:all

# Or install individually
npm install                    # Root dependencies
cd backend && npm install      # Backend dependencies
cd ../frontend && npm install  # Frontend dependencies
```

## Running the Application

### Option 1: Run Both Services (Recommended)
```bash
# From root directory
npm run dev
```
This starts both backend (port 5000) and frontend (port 8080) concurrently.

### Option 2: Run Services Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Testing Checklist

### 1. Authentication Flow
- [ ] **Landing Page** (`/`)
  - Public dashboard data loads (eco stats, top schools)
  - Navigation to login/register works
  
- [ ] **Register** (`/register`)
  - Schools dropdown loads from API
  - Form validation works
  - Successful registration redirects to challenges
  - Error messages display correctly
  
- [ ] **Login** (`/login`)
  - Valid credentials authenticate successfully
  - Invalid credentials show error message
  - Successful login redirects to challenges

### 2. Challenge Submission (Student Flow)
- [ ] **Challenges Page** (`/challenges`)
  - Solo challenges load from API
  - School challenges load from API
  - Challenges grouped by frequency (daily/weekly/one-time)
  - User stats display correctly (points, level, streak)
  
- [ ] **Submit Challenge Modal**
  - Photo upload works
  - Preview displays correctly
  - Submission sends to backend
  - Success message shows with points
  - User profile updates with new points
  
- [ ] **Profile Page** (`/profile`)
  - User info displays correctly
  - Submissions list loads from API
  - Submission statuses show correctly (pending/approved/rejected)
  - Eco impact stats display
  - Badges display with earned/locked states

### 3. Review Flow (Teacher/Admin Only)
- [ ] **Review Page** (`/review`) - Requires teacher/admin role
  - Submissions list loads based on role
    - Admin: sees all submissions
    - Teacher: sees only their school's submissions
  - Photo proofs display correctly
  - Approve button works
  - Reject button works
  - Status updates in real-time

### 4. Leaderboards
- [ ] **Leaderboard Page** (`/leaderboard`)
  - Schools tab loads school rankings
  - Students tab has two filters:
    - "مدرستي" (My School) - loads school leaderboard
    - "العراق" (Iraq) - loads national leaderboard
  - Current user highlighted in student leaderboard
  - Medals display for top 3
  - Points and rankings display correctly

### 5. Navigation & Auth State
- [ ] **Protected Routes**
  - Unauthenticated users redirected to login
  - Teacher/admin routes restricted properly
  
- [ ] **Persistent Authentication**
  - Refresh page maintains login state
  - Token stored in localStorage
  - User profile fetched on page load
  
- [ ] **Logout**
  - Logout button works
  - Redirects to landing page
  - Clears auth state and localStorage

## API Endpoint Verification

### Public Endpoints (No Auth Required)
```bash
# Get all schools
curl http://localhost:5000/api/v1/schools

# Get public dashboard
curl http://localhost:5000/api/v1/dashboard/public

# Get school leaderboard
curl http://localhost:5000/api/v1/schools/leaderboard
```

### Authentication Endpoints
```bash
# Register
curl -X POST http://localhost:5000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","passwordConfirm":"password123","school_id":"SCHOOL_ID_HERE"}'

# Login
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Protected Endpoints (Require Auth Token)
```bash
# Set your token
TOKEN="your-jwt-token-here"

# Get current user
curl http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"

# Get available challenges
curl http://localhost:5000/api/v1/challenges/available \
  -H "Authorization: Bearer $TOKEN"

# Get user submissions
curl http://localhost:5000/api/v1/user-challenges \
  -H "Authorization: Bearer $TOKEN"
```

## Common Issues & Solutions

### Issue: Backend won't start
**Error:** "DB connection failed"
**Solution:** Check your MongoDB connection string in `config.env`

### Issue: Frontend shows CORS errors
**Solution:** Backend already has CORS enabled. Ensure backend is running on port 5000.

### Issue: Login succeeds but user data not showing
**Solution:** Check browser console for API errors. Verify JWT token is being sent in Authorization header.

### Issue: Photos not uploading
**Solution:** 
1. Check backend has write permissions to `public/user-challenges/img/`
2. Verify file size is under limit
3. Check file type is image/*

### Issue: Teacher can't see student submissions
**Solution:** Verify teacher and student are in the same school (same `school_id`)

## Expected API Response Formats

### Success Response
```json
{
  "status": "success",
  "data": {
    "user": { ... }
  },
  "token": "jwt-token-here"
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Error message here"
}
```

## Monitoring

### Backend Logs
Watch backend console for:
- Incoming requests (Morgan logging)
- Database queries
- Error messages

### Frontend Network Tab
Check browser DevTools Network tab for:
- API call status codes
- Response times
- Request/response payloads

### Frontend Console
Watch for:
- API errors
- State updates
- Navigation events

## Performance Considerations

- Images are uploaded as files (can be large)
- Leaderboards may have many entries
- Challenge lists filtered on backend
- Consider pagination for large datasets (future enhancement)

## Security Notes

- All sensitive endpoints require authentication
- JWT tokens expire after 90 days (configurable)
- File uploads restricted to images only
- Role-based access control enforced on backend
- MongoDB query injection protection enabled
- XSS protection via input sanitization
- HTTP parameter pollution protection

## Next Steps

After successful testing:
1. Set up production database
2. Configure production environment variables
3. Build frontend for production: `npm run build`
4. Deploy to hosting service
5. Configure HTTPS and domain
6. Set up monitoring and logging
7. Configure backup strategy for database
8. Set up CI/CD pipeline
