# routes/chat.py

from fastapi import APIRouter
from db.mongo import users_collection
from services.ai_service import generate_response
from services.knowledge_service import search_knowledge
from services.scoring_service import calculate_score, get_remaining_steps

router = APIRouter()


@router.post("/chat")
async def chat(data: dict):
    try:
        user_id = data.get("user_id", "default")
        user_input_raw = data.get("message", "").strip()

        if not user_input_raw:
            return {
                "action": "invalid_input",
                "title": "Empty Message",
                "steps": ["Please enter a valid question"],
                "tips": [],
                "urgency": "low"
            }

        user_input = user_input_raw.lower()

        # 🧠 Fetch user
        user = users_collection.find_one({"user_id": user_id}) or {}

        # 📊 Score + Remaining
        score = calculate_score(user)
        remaining_steps = get_remaining_steps(user)

        # 🧾 Context
        context = f"""
User progress: {user.get("progress", 0)}%
User score: {score}
Completed steps: {user.get("completed_steps", [])}
Remaining steps: {remaining_steps}
"""

        # 📚 Knowledge
        knowledge = search_knowledge(user_input)

        # 🤖 SYSTEM PROMPT
        system_prompt = f"""
You are VoteWise AI, an election assistant for India.

Return ONLY JSON:

{{
  "action": "snake_case_action",
  "title": "short clear title",
  "steps": ["short actionable steps"],
  "tips": ["useful real-world tips"],
  "urgency": "low/medium/high"
}}

Rules:
- Use https://voters.eci.gov.in where relevant
- Mention real forms like "Form 6"
- Keep steps short (mobile-friendly)
- Do NOT write "Step 1"
- Avoid duplicate steps
- Output ONLY JSON

User Context:
{context}

Extra Knowledge:
{knowledge if knowledge else "None"}
"""

        # 🤖 AI RESPONSE
        reply = generate_response(system_prompt, user_input)

        # 🛡️ FALLBACK
        if not isinstance(reply, dict):
            reply = {
                "action": "general_help",
                "title": "Voting Assistance",
                "steps": [str(reply)],
                "tips": [],
                "urgency": "low"
            }

        # 🔥 REMOVE DUPLICATES (IMPORTANT)
        steps = reply.get("steps", [])
        steps = list(dict.fromkeys(steps))  # remove duplicates
        reply["steps"] = steps

        # 🔥 SMART REGISTRATION DETECTION
        if any(x in user_input for x in ["register", "voter id", "apply voter", "enroll"]):
            required_steps = [
                "Go to https://voters.eci.gov.in",
                "Click on 'New Registration (Form 6)'"
            ]

            for req in reversed(required_steps):
                if not any(req.lower() in s.lower() for s in steps):
                    steps.insert(0, req)

            reply["steps"] = list(dict.fromkeys(steps))
            reply["urgency"] = "high"
            reply["action"] = "apply_for_voter_id"

        # 🔥 ADD NEXT ACTION (VERY IMPRESSIVE)
        if remaining_steps:
            reply["next_action"] = f"Next step: {remaining_steps[0]}"
        else:
            reply["next_action"] = "You are fully ready to vote 🎉"

        # 🔥 ADD SCORE INFO
        reply["meta"] = {
            "score": score,
            "progress": user.get("progress", 0)
        }

        return reply

    except Exception as e:
        print("❌ Chat Error:", e)

        return {
            "action": "error",
            "title": "Something went wrong",
            "steps": ["Please try again"],
            "tips": ["Check your internet connection"],
            "urgency": "low"
        }