# models/user_model.py

from pydantic import BaseModel, Field
from typing import List, Optional


class User(BaseModel):
    user_id: str

    # 📊 Progress tracking
    progress: int = Field(default=0, ge=0, le=100)

    # 🧠 AI score (dynamic or stored)
    score: int = Field(default=0, ge=0, le=100)

    # ✅ Completed steps (FIXED BUG HERE)
    completed_steps: List[str] = Field(default_factory=list)

    # 🎯 Optional personalization
    user_type: Optional[str] = "first_time_voter"

    # 🌐 Language preference
    language: Optional[str] = "en"