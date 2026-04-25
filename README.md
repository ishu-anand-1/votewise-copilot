# 🗳️ VoteWise AI

VoteWise AI is a smart election assistant built to help people better understand the voting process, identify misinformation, and feel more confident while participating in elections.

The idea for this project came from a simple problem: a lot of voters, especially first-time voters, struggle with confusing election procedures and misleading political information spread through social media and messaging platforms. Many people are unsure about how to register, how to verify claims, or how to make informed decisions during elections.

VoteWise AI tries to solve this by combining AI assistance, machine learning, and interactive voter education into one platform.

---

# What the Project Does

VoteWise AI helps users:

* understand voter registration steps
* learn about election procedures
* detect suspicious or misleading election-related claims
* practice decision-making through voting simulations
* prepare for election day
* access information in multiple languages

---

# Main Features

## AI Election Assistant

The platform includes an AI-powered assistant that answers election-related questions in a simple and easy-to-understand way.

Users can ask questions such as:

* How do I apply for a voter ID?
* What documents are needed for voting?
* What should I carry on election day?
* How can I check if a political claim is fake?

---

## Fake News Detection System

One of the main features of the project is the misinformation detection engine.

The system uses a combination of:

* rule-based verification
* machine learning classification
* Google Gemini AI verification

to analyze election-related claims and provide a verdict.

Possible outputs include:

* True
* False
* Misleading
* Unverified

This feature was created to help users identify misleading political content commonly spread through social media forwards and fake election campaigns.

---

## Custom Machine Learning Model

The project includes a custom-trained machine learning model for misinformation detection.

### Model Details

* Algorithm: Logistic Regression
* Text Processing: TF-IDF Vectorization
* Purpose: classify election-related content as real or fake

The model was trained on election-related misinformation examples and official election statements.

---

## Interactive Voting Scenarios

VoteWise AI also includes an interactive simulation system where users can practice responding to realistic voting situations.

Examples include:

* misinformation pressure from social groups
* vote-buying situations
* ethical voting dilemmas
* misleading political messaging

The goal is to encourage critical thinking and informed decision-making.

---

## Multilingual Support

The platform currently supports:

* English
* Hindi

This was added to make the platform more accessible for a wider audience.

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Framer Motion

## Backend

* FastAPI
* Python
* MongoDB

## AI & Machine Learning

* Groq API
* Llama 3.1
* Google Gemini AI
* Scikit-learn
* TF-IDF Vectorizer
* Logistic Regression

---

# Project Architecture

```text
Frontend (React + TypeScript)
        ↓
FastAPI Backend
        ↓
AI + ML Processing Layer
        ↓
━━━━━━━━━━━━━━━━━━━━━━
│                    │
│  ML Detection      │
│  Gemini AI         │
│  Rule Engine       │
│  Smart AI Routing  │
│                    │
━━━━━━━━━━━━━━━━━━━━━━
        ↓
MongoDB Database
```

---

# Accessibility & User Experience

While building the project, special attention was given to accessibility and usability.

The interface is:

* mobile responsive
* beginner-friendly
* multilingual
* designed with simple navigation

---

# Security

Some security practices used in the project:

* API keys stored using environment variables
* backend-only AI integrations
* protected configuration handling

---

# Challenges Faced

Some challenges during development included:

* handling inconsistent AI responses
* improving misinformation detection accuracy
* combining rule-based logic with machine learning
* creating a smooth multilingual experience

---

# Future Improvements

Planned improvements include:

* deepfake political video detection
* support for more regional languages
* voice-based election assistant
* real-time misinformation tracking
* advanced election analytics

---

# Running the Project Locally

## Frontend

```bash
cd votewise-co-pilot-main

npm install

npm run dev
```

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

---

# Deployment

Frontend deployed on:

* Vercel

Backend deployed on:

* Render

---

# Why This Project Matters

Elections work best when voters have access to reliable information and understand the process clearly.

VoteWise AI was built as an attempt to make election information easier to access, reduce the impact of misinformation, and help people participate in democracy more confidently.

---

# Developer

Ishu Anand

Full Stack & AI Developer

Interested in building AI-powered applications, scalable backend systems, and technology-driven solutions for real-world problems.
