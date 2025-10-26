# 🏎️ F1 Prediction Hub

A full-stack Formula 1 website with live standings, driver/team information, and ML-powered race predictions.

## Tech Stack
- **Frontend:** React, TailwindCSS, Recharts
- **Backend:** FastAPI, PostgreSQL
- **ML:** Python, Scikit-learn, XGBoost, FastF1

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### ML
```bash
cd ml
python -m venv ml_venv
source ml_venv/bin/activate
pip install -r requirements.txt
jupyter notebook
```

## Database Setup
```bash
# Install PostgreSQL
# Create database: f1_db
# Update .env with your credentials
```

## Project Structure
See `/docs` for detailed documentation.