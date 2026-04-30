# ======================================================
# services/gemini_service.py
# Google Gemini AI Verification Service
# ======================================================

import json
import re

import google.generativeai as genai

from config import GEMINI_API_KEY

# ======================================================
# CONFIGURE GEMINI
# ======================================================

genai.configure(
    api_key=GEMINI_API_KEY
)

print(
    "✅ Google Gemini AI initialized"
)

# ======================================================
# LOAD MODEL
# ======================================================

model = genai.GenerativeModel(
    "gemini-1.5-flash"
)

# ======================================================
# CLEAN JSON RESPONSE
# ======================================================

def clean_json_response(
    text: str,
):

    # Remove markdown blocks

    text = re.sub(
        r"```json",
        "",
        text,
    )

    text = re.sub(
        r"```",
        "",
        text,
    )

    return text.strip()

# ======================================================
# GEMINI FACT CHECK
# ======================================================

def gemini_fact_check(
    text: str,
):

    print(
        "\n🔍 Running Google Gemini AI verification..."
    )

    prompt = f"""
You are an advanced election misinformation detection AI for India.

Your task is to analyze election-related claims carefully.

Claim:

"{text}"

Classify the claim into ONE category:

- true
- false
- misleading
- unverified

Rules:

- Be neutral and factual
- Avoid assumptions
- If uncertain, return "unverified"
- Keep explanations short and clear
- Focus on Indian election-related context

Return ONLY valid JSON.

Format:

{{
  "verdict": "true/false/misleading/unverified",

  "confidence": 0-100,

  "reason": "short explanation"
}}
"""

    try:

        response = model.generate_content(
            prompt
        )

        raw_text = (
            response.text
        )

        print(
            "✅ Gemini response received"
        )

        cleaned = (
            clean_json_response(
                raw_text
            )
        )

        parsed = json.loads(
            cleaned
        )

        print(
            "✅ Google Gemini AI verification successful"
        )

        return {

            "verdict":
                parsed.get(
                    "verdict",
                    "unverified",
                ),

            "confidence":
                parsed.get(
                    "confidence",
                    50,
                ),

            "reason":
                parsed.get(
                    "reason",
                    "No explanation provided",
                ),

            "source":
                "gemini_ai",
        }

    except Exception as e:

        print(
            "❌ Gemini AI Error:",
            e,
        )

        return {

            "verdict":
                "unverified",

            "confidence":
                50,

            "reason":
                "Google Gemini AI could not verify this claim.",

            "source":
                "gemini_ai_error",
        }