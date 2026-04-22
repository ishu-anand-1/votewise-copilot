# services/knowledge_service.py

from typing import List, Optional

# 🧠 Knowledge base (expandable)
knowledge_base = [
    {
        "keywords": ["voter id", "register", "enroll", "form 6"],
        "response": "You can register online at https://voters.eci.gov.in using Form 6."
    },
    {
        "keywords": ["booth", "polling station", "where to vote"],
        "response": "Find your polling booth on https://voters.eci.gov.in under 'Search Your Name in Electoral Roll'."
    },
    {
        "keywords": ["documents", "id proof", "what to carry"],
        "response": "Carry EPIC card, Aadhaar, passport, or any valid government-issued ID."
    },
    {
        "keywords": ["age", "eligibility", "who can vote"],
        "response": "You must be 18+ years old and an Indian citizen to vote."
    },
    {
        "keywords": ["nota"],
        "response": "NOTA allows you to reject all candidates, but it does not affect election results."
    }
]


def search_knowledge(query: str) -> Optional[List[str]]:
    query = query.lower()
    results = []

    for item in knowledge_base:
        if any(keyword in query for keyword in item["keywords"]):
            results.append(item["response"])

    return results if results else None