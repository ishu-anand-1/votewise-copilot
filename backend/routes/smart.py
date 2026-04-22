# routes/smart.py

from fastapi import APIRouter
from services.router_services import detect_intent
from services.ai_service import generate_response
from routes.factcheck import hybrid_fact_check
import json

router = APIRouter()


@router.post("/smart")
async def smart_ai(data: dict):
    try:
        user_input = data.get("message", "").strip()

        if not user_input:
            return {
                "intent": "invalid",
                "response": {
                    "title": "Empty Input",
                    "message": "Please enter a valid question."
                }
            }

        # 🔍 Detect intent
        intent = detect_intent(user_input)

        # =========================
        # 🛡️ FACT CHECK
        # =========================
        if intent == "fact_check":
            result = hybrid_fact_check(user_input)

            return {
                "intent": intent,
                "response": result
            }

        # =========================
        # 🎮 SIMULATION
        # =========================
        elif intent == "simulation":
            prompt = """
Generate a realistic voting scenario for India.

Return ONLY JSON:
{
  "title": "...",
  "situation": "...",
  "choices": [
    {
      "text": "...",
      "correct": true/false,
      "explanation": "..."
    }
  ]
}
"""

            result = generate_response("You are an election trainer AI.", prompt)

            if not isinstance(result, dict):
                try:
                    result = json.loads(result)
                except:
                    result = {
                        "title": "Fallback Scenario",
                        "situation": "You are unsure whom to vote for.",
                        "choices": [
                            {
                                "text": "Research candidates",
                                "correct": True,
                                "explanation": "Always make informed decisions"
                            }
                        ]
                    }

            return {
                "intent": intent,
                "response": result
            }

        # =========================
        # 🧭 CHAT
        # =========================
        else:
            system_prompt = """
You are VoteWise AI.

Return JSON:
{
  "action": "...",
  "title": "...",
  "steps": ["..."],
  "tips": ["..."],
  "urgency": "low/medium/high"
}
"""

            result = generate_response(system_prompt, user_input)

            return {
                "intent": intent,
                "response": result
            }

    except Exception as e:
        print("❌ Smart AI Error:", e)

        return {
            "intent": "error",
            "response": {
                "title": "Error",
                "message": "Something went wrong"
            }
        }