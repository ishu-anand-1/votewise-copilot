// ======================================================
// 🧠 AI Helper Utilities
// Frontend helper utilities for VoteWise AI
// ======================================================

export type Verdict =
  | "true"
  | "false"
  | "misleading"
  | "unverified";

// ======================================================
// 🎯 Suggested Questions
// ======================================================

const QUESTION_BANK: Record<string, string[]> = {
  home: [
    "How do I check if I'm registered to vote?",
    "How can I apply for a Voter ID online?",
    "What documents are required for voting?",
    "What is Form 6 in voter registration?",
    "Can I vote without a voter ID card?",
  ],

  dashboard: [
    "Why is my readiness score low?",
    "How can I improve my voter score?",
    "What should I complete before election day?",
    "How is my voter score calculated?",
    "What are the next important steps?",
  ],

  simulation: [
    "Give me a realistic voting scenario",
    "How should I evaluate candidates?",
    "What if friends pressure me to vote?",
    "Show me a difficult ethical voting situation",
    "Generate a first-time voter challenge",
  ],

  detector: [
    "Is this WhatsApp election message fake?",
    "How do I identify fake election news?",
    "How can I detect deepfake political videos?",
    "Who are trusted Indian fact-checkers?",
    "Verify this election claim",
  ],

  twin: [
    "What happens if I don't vote?",
    "Does one vote really matter?",
    "Show future impact of low voter turnout",
    "What changes if youth voting increases?",
    "Predict future based on voting participation",
  ],

  eday: [
    "What should I carry to the polling booth?",
    "Can I use Aadhaar for voting?",
    "What if my name is missing from the voter list?",
    "How does EVM and VVPAT work?",
    "What should I do before election day?",
  ],

  ai: [
    "Explain voting rights in India",
    "How does the Election Commission work?",
    "Can AI detect fake election campaigns?",
    "How does VoteWise AI help voters?",
  ],
};

// ======================================================
// 🔥 Smart Suggestions
// ======================================================

export function suggestQuestions(context: string): string[] {
  const normalized = context.trim().toLowerCase();

  return QUESTION_BANK[normalized] || QUESTION_BANK.home;
}

// ======================================================
// 🎲 Random Suggestions Generator
// ======================================================

export function getRandomQuestions(
  context: string,
  limit = 4
): string[] {
  const questions = suggestQuestions(context);

  return [...questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

// ======================================================
// 🔍 Detect Question Type
// ======================================================

export function detectQuestionCategory(question: string): string {
  const q = question.toLowerCase();

  if (
    q.includes("fake") ||
    q.includes("fact") ||
    q.includes("whatsapp")
  ) {
    return "detector";
  }

  if (
    q.includes("scenario") ||
    q.includes("candidate") ||
    q.includes("vote pressure")
  ) {
    return "simulation";
  }

  if (
    q.includes("future") ||
    q.includes("impact") ||
    q.includes("turnout")
  ) {
    return "twin";
  }

  if (
    q.includes("booth") ||
    q.includes("evm") ||
    q.includes("vvpat")
  ) {
    return "eday";
  }

  return "home";
}