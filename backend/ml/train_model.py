# ml/train_model.py
"""
VoteWise AI
Election Misinformation Detection Model

This model classifies election-related
claims as fake or real using
TF-IDF vectorization and
Logistic Regression.
"""

import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import (
    TfidfVectorizer,
)

from sklearn.linear_model import (
    LogisticRegression,
)
import pandas as pd
import joblib

from sklearn.feature_extraction.text import (
    TfidfVectorizer,
)

from sklearn.linear_model import (
    LogisticRegression,
)

from sklearn.model_selection import (
    train_test_split,
)

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

# ======================================================
# LOAD DATASET
# ======================================================

print(
    "\n📦 Loading dataset..."
)

try:

    df = pd.read_csv(
        "fake_news.csv"
    )

except Exception as e:

    print(
        "❌ Failed to load dataset:",
        e,
    )

    exit()


# ======================================================
# VALIDATE COLUMNS
# ======================================================

required_columns = [
    "text",
    "label",
]

for col in required_columns:

    if col not in df.columns:

        print(
            f"❌ Missing column: {col}"
        )

        exit()


# ======================================================
# CLEAN DATA
# ======================================================

print(
    "\n🧹 Cleaning dataset..."
)

df = df.dropna()

df["text"] = (
    df["text"]
    .astype(str)
    .str.strip()
)

df["label"] = (
    df["label"]
    .astype(str)
    .str.strip()
    .str.lower()
)

# remove empty rows

df = df[
    df["text"] != ""
]

# keep only valid labels

df = df[
    df["label"].isin(
        [
            "fake",
            "real",
        ]
    )
]

print(
    f"✅ Total clean samples: {len(df)}"
)

# ======================================================
# LABEL DISTRIBUTION
# ======================================================

print(
    "\n📊 Label Distribution:\n"
)

print(
    df["label"]
    .value_counts()
)

# ======================================================
# FEATURES & LABELS
# ======================================================

X = df["text"]

y = df["label"]

# ======================================================
# TF-IDF VECTORIZATION
# ======================================================

print(
    "\n🧠 Vectorizing text..."
)

vectorizer = (
    TfidfVectorizer(

        lowercase=True,

        stop_words="english",

        max_features=5000,

        ngram_range=(1, 2),

        sublinear_tf=True,
    )
)

X_vec = (
    vectorizer.fit_transform(
        X
    )
)

print(
    "✅ Text vectorization complete"
)

print(
    f"📌 Feature count: {X_vec.shape[1]}"
)

# ======================================================
# TRAIN / TEST SPLIT
# ======================================================

print(
    "\n✂ Splitting dataset..."
)

(
    X_train,
    X_test,
    y_train,
    y_test,
) = train_test_split(

    X_vec,

    y,

    test_size=0.2,

    random_state=42,

    stratify=y,
)

print(
    f"✅ Training samples: {X_train.shape[0]}"
)

print(
    f"✅ Testing samples: {X_test.shape[0]}"
)

# ======================================================
# TRAIN MODEL
# ======================================================

print(
    "\n🚀 Training ML model..."
)

model = LogisticRegression(

    max_iter=1000,

    solver="liblinear",

    random_state=42,
)

model.fit(

    X_train,

    y_train,
)

print(
    "✅ Model training completed"
)

# ======================================================
# EVALUATION
# ======================================================

print(
    "\n📊 Evaluating model..."
)

preds = model.predict(
    X_test
)

accuracy = (
    accuracy_score(
        y_test,
        preds,
    )
)

print(
    f"\n🎯 Accuracy: {accuracy * 100:.2f}%"
)

# ======================================================
# CLASSIFICATION REPORT
# ======================================================

print(
    "\n📄 Classification Report:\n"
)

print(
    classification_report(
        y_test,
        preds,
    )
)

# ======================================================
# CONFUSION MATRIX
# ======================================================

print(
    "\n🧩 Confusion Matrix:\n"
)

print(
    confusion_matrix(
        y_test,
        preds,
    )
)

# ======================================================
# SAVE MODEL
# ======================================================

print(
    "\n💾 Saving model..."
)

joblib.dump(

    model,

    "model.pkl",
)

joblib.dump(

    vectorizer,

    "vectorizer.pkl",
)

print(
    "\n✅ Model saved successfully"
)

# ======================================================
# SUCCESS MESSAGE
# ======================================================

print(
    """
==========================================

🎉 TRAINING COMPLETE

==========================================

Files created:

✅ model.pkl
✅ vectorizer.pkl

Next Steps:

1. Restart FastAPI server

2. Test:
   POST /api/fact-check

3. Verify:
   source = ml_model

==========================================
"""
)