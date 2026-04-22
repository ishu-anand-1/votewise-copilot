# services/ml_service.py

import os
import joblib

# ======================================================
# BASE PATH
# ======================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

# ======================================================
# MODEL PATHS
# ======================================================

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "model.pkl",
)

VECTORIZER_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "vectorizer.pkl",
)

# ======================================================
# LOAD MODEL + VECTORIZER
# ======================================================

try:

    model = joblib.load(
        MODEL_PATH
    )

    vectorizer = joblib.load(
        VECTORIZER_PATH
    )

    print(
        "✅ ML model loaded successfully"
    )

except Exception as e:

    print(
        "❌ Failed to load ML model:",
        e,
    )

    model = None

    vectorizer = None


# ======================================================
# PREDICT FUNCTION
# ======================================================

def predict_fake_news(
    text: str,
):

    # ======================================================
    # SAFETY CHECK
    # ======================================================

    if not text.strip():

        return {
            "prediction":
                "unverified",

            "confidence": 0,

            "error":
                "Empty input",
        }

    # ======================================================
    # MODEL NOT LOADED
    # ======================================================

    if (
        model is None
        or vectorizer
        is None
    ):

        return {
            "prediction":
                "unverified",

            "confidence": 0,

            "error":
                "ML model not loaded",
        }

    try:

        # ======================================================
        # VECTORIZE INPUT
        # ======================================================

        vector = (
            vectorizer.transform(
                [text]
            )
        )

        # ======================================================
        # PREDICTION
        # ======================================================

        prediction = (
            model.predict(
                vector
            )[0]
        )

        # ======================================================
        # CONFIDENCE
        # ======================================================

        probabilities = (
            model.predict_proba(
                vector
            )[0]
        )

        confidence = round(
            max(
                probabilities
            )
            * 100,
            2,
        )

        # ======================================================
        # RESPONSE
        # ======================================================

        return {
            "prediction":
                prediction,

            "confidence":
                confidence,

            "engine":
                "Logistic Regression + TF-IDF",
        }

    except Exception as e:

        print(
            "❌ Prediction Error:",
            e,
        )

        return {
            "prediction":
                "unverified",

            "confidence": 0,

            "error":
                str(e),
        }