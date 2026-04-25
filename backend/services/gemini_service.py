# services/gemini_service.py

import google.generativeai as genai

from config import GEMINI_API_KEY

# ======================================================
# CONFIGURE GEMINI
# ======================================================

genai.configure(
    api_key=GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-1.5-flash"
)

# ======================================================
# FACT CHECK FUNCTION
# ======================================================

def gemini_fact_check(
    text: str,
):

    prompt = f"""
You are an election misinformation detector for India.

Analyze this claim:

"{text}"

Classify into:

- true
- false
- misleading
- unverified

Return ONLY JSON:

{{
  "verdict": "true/false/misleading/unverified",
  "confidence": 0-100,
  "reason": "short explanation"
}}
"""

    response = (
        model.generate_content(
            prompt
        )
    )

    return response.text