# services/ai_service.py

from groq import Groq
from config import GROQ_API_KEY
import json
import re

# 🔐 Initialize client
client = Groq(api_key=GROQ_API_KEY)


def clean_json_text(text: str) -> str:
    """
    Removes markdown code blocks like ```json ... ```
    """
    text = text.strip()

    # Remove ```json or ``` blocks
    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text)

    return text.strip()


def generate_response(system_prompt: str, user_prompt: str):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.4,
        )

        text = response.choices[0].message.content.strip()

        # 🧹 Clean markdown if exists
        text = clean_json_text(text)

        # 🧠 Try parsing JSON
        try:
            return json.loads(text)

        except json.JSONDecodeError:
            print("⚠️ JSON parse failed, returning raw response")
            return {
                "response": text
            }

    except Exception as e:
        print("❌ AI Service Error:", e)

        return {
            "response": "AI service is temporarily unavailable. Please try again."
        }