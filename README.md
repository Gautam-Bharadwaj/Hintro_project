# Hintro — Frontend Dashboard

A modern, production-ready frontend dashboard built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v3**, matching the reference design from [hintro_fe](https://github.com/Nandann018-ux/hintro_fe).

---

## Demo Video

You can watch the full walkthrough of the dashboard here:
[Download/Watch Demo Video](./public/demo_video.mov)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 with CSS Variables |
| State Management | React Context API |
| HTTP | Native `fetch` with `cache: no-store` |
| Animations | CSS keyframes (`anim-fade`, `anim-scale`, `anim-slide-left`) |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css       # CSS variables, Tailwind directives, animations
│   ├── layout.tsx        # Root layout with all Context Providers
│   └── page.tsx          # Main Dashboard page
│
├── components/
│   ├── Avatar.tsx          # Color-hashed initials avatar
│   ├── CallDetailsModal.tsx # Call info sheet
│   ├── ComingSoonPanel.tsx  # Placeholder for unbuilt sections
│   ├── FeedbackHistoryModal.tsx  # View/delete past feedback
│   ├── FeedbackModal.tsx   # Star-rating feedback submission form
│   ├── LoggedOutScreen.tsx # Shown after logout action
│   ├── LogoutModal.tsx     # Logout confirmation dialog
│   ├── ProfileModal.tsx    # Edit name + avatar photo
│   ├── RecentCalls.tsx     # Day-grouped call list
│   ├── Sidebar.tsx         # Left nav (desktop sticky + mobile drawer)
│   ├── StartCallModal.tsx  # New call form
│   ├── StatCard.tsx        # Single metric card
│   ├── Topbar.tsx          # Header with user menu & user switcher
│   ├── TutorialModal.tsx   # Tutorial video modal
│   ├── UpgradeModal.tsx    # Subscription plan picker
│   └── icons.tsx           # All SVG icons as React components
│
├── context/
│   ├── FeedbackContext.tsx # Feedback entries stored in localStorage
│   ├── ProfileContext.tsx  # Profile name/photo overrides in localStorage
│   ├── ToastContext.tsx    # Global toast notification system
│   └── UserContext.tsx     # Active userId (u1/u2) in localStorage
│
└── lib/
    ├── api.ts      # fetch wrapper with x-user-id header
    ├── format.ts   # Duration, relative time, clock, date formatters
    ├── image.ts    # Client-side image resize via canvas
    └── types.ts    # TypeScript interfaces for all API shapes
```

---

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# → Open http://localhost:3000

# 3. Build for production
npm run build
npm start
```

---

## User States

Use the **avatar dropdown → Switch user** to toggle:

| User | State | Description |
|---|---|---|
| `u1` | Empty | Jane Smith — no calls, no history, all zeroes |
| `u2` | Filled | Jane Smith — populated with real API data |

Selection is persisted to `localStorage` key `hintro.userId`.

---

## API Endpoints Used

**Base URL:** `https://mock-backend-hintro.vercel.app`  
All requests include `x-user-id: u1|u2` header.

| Method | Path | Description |
|---|---|---|
| GET | `/api/auth/profile` | User profile |
| GET | `/api/auth/dashboard` | Dashboard + usage + subscription |
| GET | `/api/call-sessions/stats` | Aggregate call stats |
| GET | `/api/call-sessions?limit=10` | Paginated call sessions |

---

## localStorage Keys

| Key | Description |
|---|---|
| `hintro.userId` | Active user (`u1` or `u2`) |
| `hintro.feedback.<uid>` | Feedback entries per user |
| `hintro.profile.<uid>` | Profile name/photo overrides per user |

---

## Assumptions

- The project is a **client-rendered** SPA wrapped in Next.js App Router for metadata and SSR scaffolding.
- No real auth — users are switched locally via the dropdown.
- Feedback is stored only in `localStorage` (not sent to the backend).
- Profile photo is resized client-side using a Canvas and stored as a base64 data URL.
