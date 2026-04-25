# routes/factcheck.py

from fastapi import APIRouter
from services.ml_service import predict_fake_news
from services.gemini_service import gemini_fact_check

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

        "source": data.get(
            "source",
            "unknown",
        ),
    }


# ======================================================
# HYBRID FACT CHECK ENGINE
# ======================================================

def hybrid_fact_check(
    text: str,
):

    lower = text.lower().strip()

    # ======================================================
    # 1️⃣ RULE-BASED CHECKS
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
                "Offering money or rewards for votes is illegal election misinformation.",

            "source":
                "rule_based",
        }

    # 📲 Spam forwarding

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

            "verdict":
                "misleading",

            "confidence":
                85,

            "reason":
                "Mass-forwarded messages are often misleading or unverified.",

            "source":
                "rule_based",
        }

    # 🗳️ Fake voting links

    if (
        "vote online" in lower
        or "online voting link"
        in lower
    ):

        return {

            "verdict":
                "false",

            "confidence":
                90,

            "reason":
                "India does not support public online voting.",

            "source":
                "rule_based",
        }

    # ======================================================
    # 2️⃣ ML MODEL CHECK
    # ======================================================

    try:

        ml_result = (
            predict_fake_news(
                text
            )
        )

        prediction = (
            ml_result.get(
                "prediction",
                "real",
            )
        )

        confidence = (
            ml_result.get(
                "confidence",
                50,
            )
        )

        # If ML predicts fake

        if prediction == "fake":

            return {

                "verdict":
                    "false",

                "confidence":
                    confidence,

                "reason":
                    "Custom ML model detected misinformation patterns.",

                "source":
                    "ml_model",
            }

    except Exception as e:

        print(
            "❌ ML Error:",
            e,
        )

    # ======================================================
    # 3️⃣ GEMINI AI VERIFICATION
    # ======================================================

    try:

        result = (
            gemini_fact_check(
                text
            )
        )

        # Gemini may return string

        if isinstance(
            result,
            str,
        ):

            parsed = json.loads(
                result
            )

        else:

            parsed = result

        normalized = (
            normalize_result(
                parsed
            )
        )

        normalized[
            "source"
        ] = "gemini_ai"

        return normalized

    except Exception as e:

        print(
            "❌ Gemini Error:",
            e,
        )

        return {

            "verdict":
                "unverified",

            "confidence":
                50,

            "reason":
                "Unable to verify this claim.",

            "source":
                "fallback",
        }


# ======================================================
# FACT CHECK API
# ======================================================

@router.post(
    "/fact-check"
)

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

                "confidence":
                    0,

                "reason":
                    "Empty input provided.",

                "source":
                    "validation",
            },

            "meta": {

                "checked":
                    False,
            },
        }

    # ======================================================
    # RUN HYBRID ENGINE
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

        "result":
            result,

        "meta": {

            "checked":
                True,

            "engine":
                "Rules + ML + Google Gemini AI",

            "platform":
                "VoteWise AI",
        },
    }