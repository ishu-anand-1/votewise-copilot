# config.py
import os
from dotenv import load_dotenv

load_dotenv() 

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your_api_key_here")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "votewise"