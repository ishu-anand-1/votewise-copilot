// ======================================================
// 🌐 VoteWise API Service Layer
// Centralized frontend API utilities
// ======================================================

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ======================================================
// 👤 USER SESSION
// ======================================================

function generateUserId() {
  return `user_${crypto.randomUUID()}`;
}

export function getUserId() {
  let userId = localStorage.getItem("vw_user");

  if (!userId) {
    userId = generateUserId();
    localStorage.setItem("vw_user", userId);
  }

  return userId;
}

// ======================================================
// 🔥 GENERIC FETCH WRAPPER
// ======================================================

async function apiRequest<T>(
  endpoint: string,
  body?: object,
  method = "POST"
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,

      headers: {
        "Content-Type": "application/json",
      },

      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ API ERROR (${endpoint}):`, error);
    throw error;
  }
}

// ======================================================
// 🤖 CHAT API
// ======================================================

export async function chatAPI(message: string) {
  try {
    return await apiRequest("/chat", {
      message,
      user_id: getUserId(),
    });
  } catch {
    return {
      action: "error",

      title: "Connection Error",

      steps: [
        "Unable to connect to VoteWise AI backend",
      ],

      tips: [
        "Check if backend server is running",
      ],

      urgency: "low",
    };
  }
}

// ======================================================
// 🛡️ FACT CHECK API
// ======================================================

export async function factCheckAPI(text: string) {
  try {
    return await apiRequest("/fact-check", {
      text,
    });
  } catch {
    return {
      result: {
        verdict: "unverified",

        confidence: 0,

        reason:
          "Unable to verify claim due to server issue",
      },

      meta: {
        checked: false,
      },
    };
  }
}

// ======================================================
// 🎮 SCENARIO API
// ======================================================

type ScenarioResponse = {
  scenario: {
    title: string;
    situation: string;
    choices: Array<{
      text: string;
      correct: boolean;
      explanation: string;
    }>;
  };
  meta: {
    difficulty: string;
  };
};

export async function scenarioAPI(
  type = "first-time voter"
): Promise<ScenarioResponse> {
  try {
    return await apiRequest<ScenarioResponse>("/scenario", {
      type,
    });
  } catch {
    return {
      scenario: {
        title: "Scenario Unavailable",

        situation:
          "Unable to load simulation right now.",

        choices: [],
      },

      meta: {
        difficulty: "unknown",
      },
    };
  }
}

// ======================================================
// 🧠 SMART AI API
// ======================================================

export async function smartAPI(message: string) {
  try {
    return await apiRequest("/smart", {
      message,
      user_id: getUserId(),
    });
  } catch {
    return {
      intent: "error",

      response: {
        title: "AI Error",

        message:
          "VoteWise AI is temporarily unavailable.",
      },
    };
  }
}

// ======================================================
// 👤 UPDATE USER
// ======================================================

export async function updateUser(data: object) {
  try {
    return await apiRequest("/user/update", {
      user_id: getUserId(),
      ...data,
    });
  } catch {
    return {
      status: "error",
    };
  }
}

// ======================================================
// 👤 GET USER
// ======================================================

export async function getUser() {
  try {
    return await apiRequest(
      `/user/${getUserId()}`,
      undefined,
      "GET"
    );
  } catch {
    return null;
  }
}