# NovaPlex 🎬

A full-stack streaming web app where users can browse movies and TV shows, watch trailers, manage a watchlist and enjoy a seamless viewing experience — built from scratch as a portfolio project.

## 🔗 Live Demo
[View Live App](https://novaplex.vercel.app/) 

## ✨ Features

- 🎥 **Movies & TV Shows** — Browse thousands of titles via TMDB API
- 🎬 **Video Playback** — Watch official trailers and clips via YouTube
- 🔥 **Most Searched** — Trending algorithm powered by Appwrite
- 🔐 **User Authentication** — Sign up/login with email & password
- 💾 **Watchlist** — Save movies and TV shows, synced to Appwrite
- ❤️ **Liked Movies** — Like your favourite titles
- 👑 **Subscription Tiers** — Free, Basic and Premium plans
- 🔍 **Search** — Real-time search with debounce
- 🎯 **Genre & Rating Filters** — Filter by genre and minimum rating
- 📱 **Fully Responsive** — Works on mobile, tablet and desktop

## 🛠️ Tech Stack

| Tool | Version |
|------|---------|
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | v4 |
| Vite | 8 |
| Appwrite | 18 |

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/novaplex.git
cd novaplex
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your keys in `.env`:
```env
VITE_TMDB_API_KEY=your_tmdb_bearer_token
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_WATCHLIST_COLLECTION_ID=your_watchlist_collection_id
```

### 4. Run locally
```bash
npm run dev
```

## 📡 APIs Used
- **TMDB API** — Movie and TV show data, trailers
- **Appwrite** — Authentication, watchlist storage, search tracking