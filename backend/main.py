# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import chat, factcheck, simulation, user,smart
from config import GROQ_API_KEY
app = FastAPI(title="VoteWise AI Backend",
    version="1.0.0")

# CORS (IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")
app.include_router(factcheck.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(smart.router, prefix="/api")
@app.on_event("startup")
def startup_event():
    print("🚀 VoteWise Backend Starting...")

    if not GROQ_API_KEY:
        print("❌ ERROR: GROQ_API_KEY is missing!")
    else:
        print("✅ GROQ API Key Loaded")

# 🏠 ROOT
@app.get("/")
def root():
    return {
        "message": "VoteWise AI Backend Running 🚀",
        "status": "healthy"
    }