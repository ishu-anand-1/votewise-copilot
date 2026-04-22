# routes/user.py

from fastapi import APIRouter
from db.mongo import users_collection
from models.user import User

router = APIRouter()


# =========================
# 🔄 UPDATE USER
# =========================
@router.post("/user/update")
async def update_user(data: dict):
    try:
        user_id = data.get("user_id")

        if not user_id:
            return {
                "status": "error",
                "message": "user_id is required"
            }

        # 🧠 Fetch existing user
        existing_user = users_collection.find_one({"user_id": user_id}) or {}

        # ✅ Merge updates (prevents overwriting)
        updated_data = {
            "user_id": user_id,
            "progress": data.get("progress", existing_user.get("progress", 0)),
            "completed_steps": data.get("completed_steps", existing_user.get("completed_steps", [])),
            "user_type": data.get("user_type", existing_user.get("user_type", "first_time_voter")),
            "language": data.get("language", existing_user.get("language", "en")),
        }

        # 📊 Auto-calculate progress (optional smart logic)
        if updated_data["completed_steps"]:
            total_steps = 5  # you can adjust based on your system
            updated_data["progress"] = min(
                100,
                int((len(updated_data["completed_steps"]) / total_steps) * 100)
            )

        # 🧾 Validate with Pydantic
        user_obj = User(**updated_data)

        # 💾 Save to Mongo
        users_collection.update_one(
            {"user_id": user_id},
            {"$set": user_obj.dict()},
            upsert=True
        )

        return {
            "status": "success",
            "user": user_obj.dict()
        }

    except Exception as e:
        print("❌ User Update Error:", e)

        return {
            "status": "error",
            "message": "Failed to update user"
        }


# =========================
# 📥 GET USER
# =========================
@router.get("/user/{user_id}")
async def get_user(user_id: str):
    try:
        user = users_collection.find_one({"user_id": user_id}, {"_id": 0})

        if not user:
            return {
                "status": "not_found",
                "user": {}
            }

        return {
            "status": "success",
            "user": user
        }

    except Exception as e:
        print("❌ Get User Error:", e)

        return {
            "status": "error",
            "user": {}
        }