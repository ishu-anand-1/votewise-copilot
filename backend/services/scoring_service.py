# services/scoring_service.py

# 🎯 Step weight configuration (easy to extend)
STEP_WEIGHTS = {
    "registered": 30,
    "booth_checked": 20,
    "voted": 50,
    "voter_id_downloaded": 10,
    "simulation_completed": 10,
    "fact_checked": 5
}


def calculate_score(user: dict) -> int:
    try:
        steps = user.get("completed_steps", [])
        score = 0

        # 🧠 Dynamic scoring
        for step in steps:
            score += STEP_WEIGHTS.get(step, 0)

        # 📊 Cap score at 100
        return min(score, 100)

    except Exception as e:
        print("❌ Scoring Error:", e)
        return 0


# 🔥 BONUS: Get missing steps (VERY USEFUL FOR AI + UI)
def get_remaining_steps(user: dict):
    completed = set(user.get("completed_steps", []))
    all_steps = set(STEP_WEIGHTS.keys())

    return list(all_steps - completed)


# 🔥 BONUS: Readiness level (great for UI)
def get_readiness_level(score: int) -> str:
    if score >= 80:
        return "Ready to Vote"
    elif score >= 50:
        return "Almost Ready"
    elif score >= 20:
        return "Getting Started"
    else:
        return "Not Ready"