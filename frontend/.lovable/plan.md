

# 🌱 EcoLearn Iraq — Implementation Plan

## Overview
A mobile-first, Arabic RTL gamified environmental challenges app with 7 pages, using mock/static data throughout. Clean green-themed UI with Google Fonts (Cairo or Tajawal).

---

## Step 1: Theme & Foundation
- Apply the custom green/blue/orange color theme to the design system
- Import Arabic Google Font (Cairo)
- Set up global RTL direction (`dir="rtl"`)
- Configure base styles: light green background, rounded cards with shadows, consistent spacing

## Step 2: Landing Page (`/`)
- Header with logo "🌱 إيكو تعلم" and login/register buttons
- Hero section with headline, subheadline, CTA button, and social proof text
- 3 feature cards (challenges, competition, school vs school)
- Top 5 schools leaderboard preview
- Simple footer "صنع بـ 💚 للعراق"

## Step 3: Auth Pages (`/register` & `/login`)
- **Register**: centered card with name, email (LTR input), password (with toggle), school dropdown, and submit button
- **Login**: similar card with email, password, and submit button
- Navigation links between the two pages
- No real auth — just form UI with navigation to challenges page on submit

## Step 4: Challenges Page (`/challenges`)
- Sticky header with logo and user avatar
- Stats card with green-to-blue gradient (points, level, streak)
- 7 challenge cards with emoji, title, description, points badge, and submit button
- Fixed bottom navigation bar (4 tabs: Home, Leaderboard, Achievements, Profile)

## Step 5: Submit Challenge Modal
- Modal triggered by "أرسل الإثبات" button
- Displays challenge name and points
- Dashed upload area with camera icon (file input for image)
- Image preview after selection with remove button
- Success state with confetti emoji and points animation

## Step 6: Leaderboard Page (`/leaderboard`)
- Tab switcher: Students / Schools
- Students tab with filter buttons (class, school, Iraq) and ranked list with current user highlighted
- Schools tab with filter buttons and ranked list with user's school highlighted
- Same header and bottom navigation

## Step 7: Profile Page (`/profile`)
- Profile card with avatar, name, school, join date
- 2×2 stats grid (points, level, challenges, streak)
- Level progress bar with text
- Badges grid (2 earned, 4 locked/grayed out)
- Recent activity list
- Logout button (navigates back to landing)
- Same bottom navigation

## Design Details
- Mobile-first (375px), responsive up to desktop
- All text in Arabic, RTL layout throughout
- Smooth hover/press transitions on buttons and cards
- Skeleton loading states on data sections
- Empty states with friendly emoji messages
- Bottom nav: white, top shadow, green active state

