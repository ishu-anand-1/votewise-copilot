# services/router_services.py

from services.ai_service import generate_response

VALID_INTENTS = {"chat", "fact_check", "simulation"}


def detect_intent(user_input: str) -> str:
    try:
        prompt = f"""
Classify the user query into EXACTLY one category:

- chat
- fact_check
- simulation

Query: "{user_input}"

Rules:
- Return ONLY one word
- No explanation
- Must be one of: chat, fact_check, simulation
"""

        result = generate_response("You are an intent classifier.", prompt)

        # 🧠 Handle JSON or string response
        if isinstance(result, dict):
            intent = result.get("intent") or result.get("response", "")
        else:
            intent = str(result)

        intent = intent.strip().lower()

        # 🛡️ Validate output
        if intent not in VALID_INTENTS:
            return "chat"

        return intent

    except Exception as e:
        print("❌ Intent Detection Error:", e)
        return "chat"