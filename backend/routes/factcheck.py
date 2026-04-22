# routes/factcheck.py

from fastapi import APIRouter
from services.ai_service import generate_response
from services.ml_service import predict_fake_news

import json

router = APIRouter()

# ======================================================
# NORMALIZE OUTPUT
# ======================================================

def normalize_result(data: dict):
    return {
        "verdict": data.get(
            "verdict",
            "unverified",
        ),

        "confidence": max(
            0,
            min(
                100,
                int(
                    data.get(
                        "confidence",
                        50,
                    )
                ),
            ),
        ),

        "reason": data.get(
            "reason",
            "No explanation provided",
        ),
    }


# ======================================================
# HYBRID FACT CHECK ENGINE
# RULES + ML + AI
# ======================================================

def hybrid_fact_check(text: str):

    lower = text.lower().strip()

    # ======================================================
    # 1️⃣ RULE-BASED DETECTION
    # ======================================================

    # 💰 Vote buying
    if any(
        x in lower
        for x in [
            "₹",
            "cash",
            "free money",
            "gift",
            "reward",
        ]
    ):
        return {
            "verdict": "false",

            "confidence": 95,

            "reason":
                "Offering money or rewards for votes is illegal and considered election misinformation.",

            "source": "rule_based",
        }

    # 📲 Fake forwards
    if any(
        x in lower
        for x in [
            "forward this",
            "share with",
            "send to 10 people",
            "urgent forward",
        ]
    ):
        return {
            "verdict": "misleading",

            "confidence": 85,

            "reason":
                "Messages encouraging mass forwarding are often misleading or unverified.",

            "source": "rule_based",
        }

    # 🗳️ Fake online voting
    if (
        "vote online" in lower
        or "online voting link"
        in lower
    ):
        return {
            "verdict": "false",

            "confidence": 90,

            "reason":
                "India does not support public online voting for elections.",

            "source": "rule_based",
        }

    # ======================================================
    # 2️⃣ ML MODEL PREDICTION
    # ======================================================

    try:

        ml_result = predict_fake_news(
            text
        )

        prediction = ml_result.get(
            "prediction",
            "real",
        )

        confidence = ml_result.get(
            "confidence",
            50,
        )

        # fake => false
        if prediction == "fake":

            return {
                "verdict": "false",

                "confidence":
                    confidence,

                "reason":
                    "Custom ML model detected possible misinformation patterns.",

                "source": "ml_model",
            }

    except Exception as e:
        print(
            "❌ ML Model Error:",
            e,
        )

    # ======================================================
    # 3️⃣ AI FACT CHECK
    # ======================================================

    prompt = f"""
You are a strict election fact-checking AI for India.

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

Rules:
- Keep response concise
- Use 'unverified' if unsure
- No extra text outside JSON
"""

    result = generate_response(
        "You are a fact-checking AI.",
        prompt,
    )

    # ======================================================
    # SAFE JSON PARSE
    # ======================================================

    try:

        if isinstance(
            result,
            dict,
        ):
            parsed = result

        else:
            parsed = json.loads(
                result
            )

        normalized = (
            normalize_result(
                parsed
            )
        )

        normalized[
            "source"
        ] = "ai_model"

        return normalized

    except Exception as e:

        print(
            "❌ AI Parse Error:",
            e,
        )

        return {
            "verdict":
                "unverified",

            "confidence": 50,

            "reason":
                "Unable to fully verify the claim. Please check official sources like https://eci.gov.in.",

            "source":
                "fallback",
        }


# ======================================================
# API ROUTE
# ======================================================

@router.post("/fact-check")
async def fact_check(
    data: dict,
):

    text = (
        data.get(
            "text",
            "",
        )
        .strip()
    )

    # ======================================================
    # EMPTY INPUT
    # ======================================================

    if not text:

        return {
            "result": {
                "verdict":
                    "unverified",

                "confidence": 0,

                "reason":
                    "Empty input provided.",
            },

            "meta": {
                "checked":
                    False
            },
        }

    # ======================================================
    # RUN ENGINE
    # ======================================================

    result = (
        hybrid_fact_check(
            text
        )
    )

    # ======================================================
    # RESPONSE
    # ======================================================

    return {
        "result": result,

        "meta": {
            "checked": True,

            "engine":
                "Hybrid AI + ML + Rules",

            "platform":
                "VoteWise AI",
        },
    }