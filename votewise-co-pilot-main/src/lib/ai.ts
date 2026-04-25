// ======================================================
// 🧠 VoteWise AI Helper Utilities
// Smart frontend helper system
// ======================================================

export type Verdict =
  | "true"
  | "false"
  | "misleading"
  | "unverified";

// ======================================================
// 🌍 MULTI LANGUAGE QUESTION TYPE
// ======================================================

type MultiLangQuestion = {
  en: string;
  hi: string;
};

// ======================================================
// 🎯 QUESTION BANK
// ======================================================

const QUESTION_BANK: Record<
  string,
  MultiLangQuestion[]
> = {

  // ======================================================
  // HOME
  // ======================================================

  home: [

    {
      en: "How do I check if I'm registered to vote?",

      hi: "मैं कैसे जांचूं कि मैं वोटर सूची में पंजीकृत हूँ?",
    },

    {
      en: "How can I apply for a Voter ID online?",

      hi: "मैं ऑनलाइन वोटर आईडी के लिए कैसे आवेदन करूं?",
    },

    {
      en: "What documents are required for voting?",

      hi: "वोट देने के लिए कौन से दस्तावेज़ चाहिए?",
    },

    {
      en: "What is Form 6 in voter registration?",

      hi: "वोटर पंजीकरण में फॉर्म 6 क्या है?",
    },

    {
      en: "Can I vote without a voter ID card?",

      hi: "क्या मैं वोटर आईडी कार्ड के बिना वोट दे सकता हूँ?",
    },
  ],

  // ======================================================
  // DASHBOARD
  // ======================================================

  dashboard: [

    {
      en: "Why is my readiness score low?",

      hi: "मेरा तैयारी स्कोर कम क्यों है?",
    },

    {
      en: "How can I improve my voter score?",

      hi: "मैं अपना वोटर स्कोर कैसे बढ़ाऊं?",
    },

    {
      en: "What should I complete before election day?",

      hi: "मुझे चुनाव दिवस से पहले क्या पूरा करना चाहिए?",
    },

    {
      en: "How is my voter score calculated?",

      hi: "मेरा वोटर स्कोर कैसे गणना किया जाता है?",
    },

    {
      en: "What are the next important steps?",

      hi: "अगले महत्वपूर्ण कदम क्या हैं?",
    },
  ],

  // ======================================================
  // SIMULATION
  // ======================================================

  simulation: [

    {
      en: "Give me a realistic voting scenario",

      hi: "मुझे एक वास्तविक मतदान परिस्थिति दें",
    },

    {
      en: "How should I evaluate candidates?",

      hi: "मुझे उम्मीदवारों का मूल्यांकन कैसे करना चाहिए?",
    },

    {
      en: "What if friends pressure me to vote?",

      hi: "अगर दोस्त मुझे वोट देने के लिए दबाव डालें तो क्या करें?",
    },

    {
      en: "Show me a difficult ethical voting situation",

      hi: "मुझे एक कठिन नैतिक मतदान स्थिति दिखाएँ",
    },

    {
      en: "Generate a first-time voter challenge",

      hi: "पहली बार वोटर के लिए चुनौती बनाएं",
    },
  ],

  // ======================================================
  // FACT CHECK
  // ======================================================

  detector: [

    {
      en: "Is this WhatsApp election message fake?",

      hi: "क्या यह WhatsApp चुनाव संदेश नकली है?",
    },

    {
      en: "How do I identify fake election news?",

      hi: "मैं नकली चुनाव समाचार कैसे पहचानूं?",
    },

    {
      en: "How can I detect deepfake political videos?",

      hi: "मैं डीपफेक राजनीतिक वीडियो कैसे पहचानूं?",
    },

    {
      en: "Who are trusted Indian fact-checkers?",

      hi: "भारत के विश्वसनीय फैक्ट-चेकर्स कौन हैं?",
    },

    {
      en: "Verify this election claim",

      hi: "इस चुनाव दावे की जांच करें",
    },
  ],

  // ======================================================
  // DIGITAL TWIN
  // ======================================================

  twin: [

    {
      en: "What happens if I don't vote?",

      hi: "अगर मैं वोट नहीं दूं तो क्या होगा?",
    },

    {
      en: "Does one vote really matter?",

      hi: "क्या एक वोट वास्तव में मायने रखता है?",
    },

    {
      en: "Show future impact of low voter turnout",

      hi: "कम मतदान का भविष्य पर प्रभाव दिखाएं",
    },

    {
      en: "What changes if youth voting increases?",

      hi: "अगर युवा मतदान बढ़े तो क्या बदलेगा?",
    },

    {
      en: "Predict future based on voting participation",

      hi: "मतदान भागीदारी के आधार पर भविष्य बताएं",
    },
  ],

  // ======================================================
  // ELECTION DAY
  // ======================================================

  eday: [

    {
      en: "What should I carry to the polling booth?",

      hi: "मुझे मतदान केंद्र पर क्या ले जाना चाहिए?",
    },

    {
      en: "Can I use Aadhaar for voting?",

      hi: "क्या मैं वोटिंग के लिए आधार कार्ड इस्तेमाल कर सकता हूँ?",
    },

    {
      en: "What if my name is missing from voter list?",

      hi: "अगर मेरा नाम वोटर सूची में नहीं है तो क्या करें?",
    },

    {
      en: "How do EVM and VVPAT work?",

      hi: "EVM और VVPAT कैसे काम करते हैं?",
    },

    {
      en: "What should I do before election day?",

      hi: "मुझे चुनाव दिवस से पहले क्या करना चाहिए?",
    },
  ],

  // ======================================================
  // AI
  // ======================================================

  ai: [

    {
      en: "Explain voting rights in India",

      hi: "भारत में मतदान अधिकार समझाएं",
    },

    {
      en: "How does the Election Commission work?",

      hi: "चुनाव आयोग कैसे काम करता है?",
    },

    {
      en: "Can AI detect fake election campaigns?",

      hi: "क्या AI नकली चुनाव प्रचार पहचान सकता है?",
    },

    {
      en: "How does VoteWise AI help voters?",

      hi: "VoteWise AI वोटरों की कैसे मदद करता है?",
    },
  ],
};

// ======================================================
// 🎯 GET QUESTIONS
// ======================================================

export function suggestQuestions(
  context: string,
  lang: "en" | "hi" = "en"
): string[] {

  const normalized =
    context
      .trim()
      .toLowerCase();

  const questions =
    QUESTION_BANK[
      normalized
    ] ||
    QUESTION_BANK.home;

  return questions.map(
    (q) => q[lang]
  );
}

// ======================================================
// 🎲 RANDOM QUESTIONS
// ======================================================

export function getRandomQuestions(
  context: string,

  lang:
    | "en"
    | "hi" = "en",

  limit = 4
): string[] {

  const questions =
    suggestQuestions(
      context,
      lang
    );

  return [
    ...questions,
  ]

    .sort(
      () =>
        Math.random() -
        0.5
    )

    .slice(
      0,
      limit
    );
}

// ======================================================
// 🔍 DETECT CATEGORY
// ======================================================

export function detectQuestionCategory(
  question: string
): string {

  const q =
    question.toLowerCase();

  // ======================================================
  // FACT CHECK
  // ======================================================

  if (

    q.includes(
      "fake"
    ) ||

    q.includes(
      "fact"
    ) ||

    q.includes(
      "whatsapp"
    ) ||

    q.includes(
      "deepfake"
    )

  ) {

    return "detector";
  }

  // ======================================================
  // SIMULATION
  // ======================================================

  if (

    q.includes(
      "scenario"
    ) ||

    q.includes(
      "candidate"
    ) ||

    q.includes(
      "pressure"
    ) ||

    q.includes(
      "ethical"
    )

  ) {

    return "simulation";
  }

  // ======================================================
  // DIGITAL TWIN
  // ======================================================

  if (

    q.includes(
      "future"
    ) ||

    q.includes(
      "impact"
    ) ||

    q.includes(
      "turnout"
    ) ||

    q.includes(
      "vote matter"
    )

  ) {

    return "twin";
  }

  // ======================================================
  // ELECTION DAY
  // ======================================================

  if (

    q.includes(
      "booth"
    ) ||

    q.includes(
      "evm"
    ) ||

    q.includes(
      "vvpat"
    ) ||

    q.includes(
      "aadhaar"
    )

  ) {

    return "eday";
  }

  // ======================================================
  // DEFAULT
  // ======================================================

  return "home";
}