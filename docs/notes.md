# 🏎️ F1 Full Stack

## Planning
- Project setup and architecture
- Database Design and Setup
- Backend Developement
- Machine learning pipeline
- Frontend Developement
- Integration and testing
- Deployement
- Post Deployement

## PHASE 1 :

### 1) Backend(venv)

```bash
venv\Scripts\activate
uvicorn app.main:app --reload
```

### 2) Machine Learning(ml_venv)

```bash
ml_venv\Scipts\activate
```

### 3) Frontend
```bash
npm run dev
```

### 4) Database

    postgreSQL :- f1_db
<pre>
┌─────────────────────────────────────────┐
│  FRONTEND (React)                       │
│  Platform: Vercel ⭐ EASIEST           │
│  Deploy: Connect GitHub, auto-deploy   │
│  URL: https://f1-hub.vercel.app        │
└─────────────────────────────────────────┘
              ↓ API Calls
┌─────────────────────────────────────────┐
│  BACKEND (FastAPI)                      │
│  Platform: Render ⭐⭐ EASY             │
│  Deploy: Connect GitHub, auto-deploy   │
│  URL: https://f1-hub-api.onrender.com  │
└─────────────────────────────────────────┘
              ↓ Database Queries
┌─────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                  │
│  Platform: Neon ⭐ EASIEST              │
│  Setup: Click create, copy URL          │
│  Connection: Cloud-hosted               │
└─────────────────────────────────────────┘
</pre>

## PHASE 2:

![!\[alt text\](docs\image.png)](image.png)

## PHASE 3:

![alt text](image-1.png)
![alt text](image-2.png)

## PHASE 4:

1) Install FastF1 library (official F1 data source)
2) Fetch 2024 season data (complete results)
3) Populate all tables with real information
4) Test standings with actual championship data
5) Build ML models for predictions
6) Generate 2025 race predictions