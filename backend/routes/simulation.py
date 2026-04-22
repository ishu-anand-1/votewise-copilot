# routes/simulation.py

from fastapi import APIRouter
from services.ai_service import generate_response
import json

router = APIRouter()


@router.post("/scenario")
async def generate_scenario(data: dict):
    try:
        user_type = data.get("type", "first-time voter")
        difficulty = data.get("difficulty", "medium")

        # 🎯 PROMPT (UPGRADED)
        prompt = f"""
You are VoteWise AI, an election training assistant for India.

Create a realistic voting scenario for a {user_type}.

Difficulty: {difficulty}

Return ONLY JSON:

{{
  "title": "short scenario title",
  "situation": "real-life situation (2-3 lines)",
  "choices": [
    {{
      "text": "user decision option",
      "correct": true/false,
      "explanation": "why this choice is right or wrong"
    }}
  ]
}}

Rules:
- Create 3–4 choices
- Only ONE correct answer
- Make it realistic (peer pressure, fake news, confusion, etc.)
- Keep language simple and practical
- Do NOT include text outside JSON
"""

        result = generate_response("You are an election training AI.", prompt)

        # 🛡️ SAFE JSON PARSE
        try:
            if isinstance(result, dict):
                scenario = result
            else:
                scenario = json.loads(result)

        except Exception as e:
            print("❌ Scenario JSON Error:", e)

            # 🔥 fallback scenario (very important for demo)
            scenario = {
                "title": "Peer Pressure Voting",
                "situation": "Your friends ask you to vote for a candidate without researching.",
                "choices": [
                    {
                        "text": "Vote based on friends' suggestion",
                        "correct": False,
                        "explanation": "Voting blindly can lead to poor decisions."
                    },
                    {
                        "text": "Research candidates before voting",
                        "correct": True,
                        "explanation": "Informed voting leads to better democratic outcomes."
                    },
                    {
                        "text": "Skip voting",
                        "correct": False,
                        "explanation": "Not voting reduces your impact on democracy."
                    }
                ]
            }

        # 🎯 VALIDATION (ENSURE STRUCTURE)
        if "choices" not in scenario or not scenario["choices"]:
            scenario["choices"] = [
                {
                    "text": "Research candidates before voting",
                    "correct": True,
                    "explanation": "Always make informed decisions."
                }
            ]

        return {
            "scenario": scenario,
            "meta": {
                "type": user_type,
                "difficulty": difficulty
            }
        }

    except Exception as e:
        print("❌ Simulation Error:", e)

        return {
            "scenario": {
                "title": "Error",
                "situation": "Could not generate scenario",
                "choices": [
                    {
                        "text": "Try again",
                        "correct": True,
                        "explanation": "Retry the simulation."
                    }
                ]
            }
        }