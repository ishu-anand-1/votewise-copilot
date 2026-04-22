# ml/train_model.py

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
)

# ======================================================
# LOAD DATASET
# ======================================================

print(
    "\n📦 Loading dataset..."
)

df = pd.read_csv(
    "fake_news.csv"
)

# ======================================================
# CLEAN DATA
# ======================================================

df = df.dropna()

df["text"] = df["text"].astype(
    str
)

df["label"] = df[
    "label"
].astype(str)

print(
    f"✅ Total samples: {len(df)}"
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

vectorizer = TfidfVectorizer(
    lowercase=True,

    stop_words="english",

    max_features=5000,

    ngram_range=(1, 2),
)

X_vec = (
    vectorizer.fit_transform(X)
)

print(
    "✅ Text vectorization complete"
)

# ======================================================
# TRAIN / TEST SPLIT
# ======================================================

X_train, X_test, y_train, y_test = (
    train_test_split(
        X_vec,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )
)

# ======================================================
# TRAIN MODEL
# ======================================================

print(
    "\n🚀 Training ML model..."
)

model = LogisticRegression(
    max_iter=1000
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

accuracy = accuracy_score(
    y_test,
    preds,
)

print(
    f"\n🎯 Accuracy: {accuracy * 100:.2f}%"
)

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

print(
    """
==========================================
🎉 TRAINING COMPLETE
==========================================

Files created:

✅ model.pkl
✅ vectorizer.pkl

Now connect it to:
services/ml_service.py
==========================================
"""
)