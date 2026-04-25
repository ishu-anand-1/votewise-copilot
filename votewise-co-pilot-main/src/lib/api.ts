// ======================================================
// 🌐 VoteWise API Service Layer
// Centralized API utilities
// ======================================================

// ======================================================
// BASE URL
// ======================================================

const BASE_URL =

  import.meta.env
    .VITE_API_URL ||

  "http://localhost:8000/api";

// ======================================================
// TYPES
// ======================================================

export type Verdict =

  | "true"
  | "false"
  | "misleading"
  | "unverified";

// ======================================================
// CHAT RESPONSE
// ======================================================

export type ChatResponse = {

  action: string;

  title: string;

  steps: string[];

  tips: string[];

  urgency:
    | "low"
    | "medium"
    | "high";
};

// ======================================================
// FACT CHECK RESPONSE
// ======================================================

export type FactCheckResponse = {

  result: {

    verdict: Verdict;

    confidence: number;

    reason: string;

    source?: string;
  };

  meta?: {

    checked: boolean;

    engine?: string;

    platform?: string;
  };
};

// ======================================================
// SCENARIO RESPONSE
// ======================================================

export type ScenarioResponse = {

  scenario: {

    title: string;

    situation: string;

    choices: Array<{

      text: string;

      correct: boolean;

      explanation: string;
    }>;
  };

  meta?: {

    difficulty?: string;
  };
};

// ======================================================
// SMART RESPONSE
// ======================================================

export type SmartResponse = {

  intent: string;

  response: any;
};

// ======================================================
// USER RESPONSE
// ======================================================

export type UserResponse = {

  status?: string;

  user?: any;
};

// ======================================================
// USER SESSION
// ======================================================

function generateUserId() {

  return `user_${crypto.randomUUID()}`;
}

// ======================================================
// GET USER ID
// ======================================================

export function getUserId() {

  let userId =
    localStorage.getItem(
      "vw_user"
    );

  if (!userId) {

    userId =
      generateUserId();

    localStorage.setItem(
      "vw_user",
      userId
    );
  }

  return userId;
}

// ======================================================
// GENERIC API WRAPPER
// ======================================================

async function apiRequest<T>(

  endpoint: string,

  options?: {

    method?: string;

    body?: object;
  }

): Promise<T> {

  try {

    const response =
      await fetch(

        `${BASE_URL}${endpoint}`,

        {

          method:
            options?.method ||
            "POST",

          headers: {

            "Content-Type":
              "application/json",
          },

          body:
            options?.body
              ? JSON.stringify(
                  options.body
                )
              : undefined,
        }
      );

    // ======================================================
    // HANDLE ERROR
    // ======================================================

    if (!response.ok) {

      throw new Error(

        `API Error: ${response.status}`

      );
    }

    // ======================================================
    // RETURN JSON
    // ======================================================

    return await response.json();

  } catch (error) {

    console.error(

      `❌ API ERROR (${endpoint})`,

      error
    );

    throw error;
  }
}

// ======================================================
// 🤖 CHAT API
// ======================================================

export async function chatAPI(

  message: string

): Promise<ChatResponse> {

  try {

    return await apiRequest<ChatResponse>(

      "/chat",

      {

        body: {

          message,

          user_id:
            getUserId(),
        },
      }
    );

  } catch {

    return {

      action: "error",

      title:
        "Connection Error",

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
// 🛡 FACT CHECK API
// ======================================================

export async function factCheckAPI(

  text: string

): Promise<FactCheckResponse> {

  try {

    return await apiRequest<FactCheckResponse>(

      "/fact-check",

      {

        body: {
          text,
        },
      }
    );

  } catch {

    return {

      result: {

        verdict:
          "unverified",

        confidence: 0,

        reason:
          "Unable to verify claim due to server issue",

        source:
          "fallback",
      },

      meta: {

        checked: false,

        engine:
          "fallback",
      },
    };
  }
}

// ======================================================
// 🎮 SCENARIO API
// ======================================================

export async function scenarioAPI(

  type =
    "first-time voter"

): Promise<ScenarioResponse> {

  try {

    return await apiRequest<ScenarioResponse>(

      "/scenario",

      {

        body: {
          type,
        },
      }
    );

  } catch {

    return {

      scenario: {

        title:
          "Scenario Unavailable",

        situation:
          "Unable to load simulation right now.",

        choices: [],
      },

      meta: {

        difficulty:
          "unknown",
      },
    };
  }
}

// ======================================================
// 🧠 SMART AI API
// ======================================================

export async function smartAPI(

  message: string

): Promise<SmartResponse> {

  try {

    return await apiRequest<SmartResponse>(

      "/smart",

      {

        body: {

          message,

          user_id:
            getUserId(),
        },
      }
    );

  } catch {

    return {

      intent:
        "error",

      response: {

        title:
          "AI Error",

        message:
          "VoteWise AI is temporarily unavailable.",
      },
    };
  }
}

// ======================================================
// 👤 UPDATE USER
// ======================================================

export async function updateUser(

  data: object

): Promise<UserResponse> {

  try {

    return await apiRequest<UserResponse>(

      "/user/update",

      {

        body: {

          user_id:
            getUserId(),

          ...data,
        },
      }
    );

  } catch {

    return {

      status:
        "error",
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

      {

        method:
          "GET",
      }
    );

  } catch {

    return null;
  }
}

// ======================================================
// 🔥 HEALTH CHECK
// ======================================================

export async function healthCheck() {

  try {

    return await apiRequest(

      "/",

      {
        method:
          "GET",
      }
    );

  } catch {

    return {

      status:
        "offline",
    };
  }
}