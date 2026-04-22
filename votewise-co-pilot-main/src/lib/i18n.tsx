import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

// ======================================================
// 🌍 LANGUAGE TYPES
// ======================================================

export type Lang = "en" | "hi";

// ======================================================
// 🧠 TRANSLATION DICTIONARY
// ======================================================

type Translation = {
  en: string;
  hi: string;
};

type Dict = Record<string, Translation>;

export const dict: Dict = {
  // ======================================================
  // BRANDING
  // ======================================================

  brand: {
    en: "VoteWise AI",
    hi: "वोटवाइज़ AI",
  },

  tagline: {
    en: "Your Election Co-Pilot",
    hi: "आपका चुनाव सहायक",
  },

  // ======================================================
  // HERO
  // ======================================================

  hero_title: {
    en: "Become the smartest voter you know.",
    hi: "अपने आसपास का सबसे समझदार मतदाता बनें।",
  },

  hero_sub: {
    en: "Learn, practice, and vote confidently in just a few minutes.",
    hi: "कुछ ही मिनटों में सीखें, अभ्यास करें और आत्मविश्वास से वोट करें।",
  },

  cta_start: {
    en: "Start in 5 mins",
    hi: "5 मिनट में शुरू करें",
  },

  cta_demo: {
    en: "See Demo",
    hi: "डेमो देखें",
  },

  // ======================================================
  // NAVIGATION
  // ======================================================

  nav_home: {
    en: "Home",
    hi: "होम",
  },

  nav_dashboard: {
    en: "Dashboard",
    hi: "डैशबोर्ड",
  },

  nav_simulation: {
    en: "Practice",
    hi: "अभ्यास",
  },

  nav_detector: {
    en: "Fact Check",
    hi: "तथ्य जांच",
  },

  nav_twin: {
    en: "Voter Twin",
    hi: "वोटर ट्विन",
  },

  nav_eday: {
    en: "Election Day",
    hi: "मतदान दिवस",
  },

  // ======================================================
  // AI CHAT
  // ======================================================

  ask_ai: {
    en: "Ask AI",
    hi: "AI से पूछें",
  },

  ask_placeholder: {
    en: "Ask anything about voting...",
    hi: "वोटिंग के बारे में कुछ भी पूछें...",
  },

  send: {
    en: "Send",
    hi: "भेजें",
  },

  suggested: {
    en: "Suggested Questions",
    hi: "सुझाए गए प्रश्न",
  },

  // ======================================================
  // DASHBOARD
  // ======================================================

  d_title: {
    en: "Your Voter Dashboard",
    hi: "आपका वोटर डैशबोर्ड",
  },

  d_sub: {
    en: "Track your readiness and election progress.",
    hi: "अपनी तैयारी और चुनाव प्रगति को ट्रैक करें।",
  },

  d_readiness: {
    en: "Readiness",
    hi: "तैयारी",
  },

  d_score: {
    en: "Voter Score",
    hi: "वोटर स्कोर",
  },

  d_next: {
    en: "Next Step",
    hi: "अगला कदम",
  },

  d_journey: {
    en: "Your Journey",
    hi: "आपकी यात्रा",
  },

  // ======================================================
  // SIMULATION
  // ======================================================

  s_title: {
    en: "Practice Scenarios",
    hi: "अभ्यास परिदृश्य",
  },

  s_sub: {
    en: "Train yourself with realistic voting situations.",
    hi: "वास्तविक मतदान परिस्थितियों के साथ अभ्यास करें।",
  },

  // ======================================================
  // FACT CHECK
  // ======================================================

  fc_title: {
    en: "Fake News Detector",
    hi: "फर्जी समाचार जांच",
  },

  fc_sub: {
    en: "Verify election claims instantly using AI.",
    hi: "AI की मदद से चुनावी दावों की तुरंत जांच करें।",
  },

  fc_paste: {
    en: "Paste claim or WhatsApp forward...",
    hi: "दावा या व्हाट्सएप संदेश पेस्ट करें...",
  },

  fc_check: {
    en: "Check Now",
    hi: "अभी जांचें",
  },

  // ======================================================
  // VOTER TWIN
  // ======================================================

  t_title: {
    en: "Digital Voter Twin",
    hi: "डिजिटल वोटर ट्विन",
  },

  t_sub: {
    en: "Explore future outcomes based on your voting choices.",
    hi: "अपने मतदान निर्णयों के भविष्य प्रभाव देखें।",
  },

  // ======================================================
  // ELECTION DAY
  // ======================================================

  e_title: {
    en: "Election Day Mode",
    hi: "मतदान दिवस मोड",
  },

  e_sub: {
    en: "Stay prepared on election day.",
    hi: "मतदान दिवस पर पूरी तैयारी रखें।",
  },

  // ======================================================
  // COMMON
  // ======================================================

  loading: {
    en: "Loading...",
    hi: "लोड हो रहा है...",
  },

  error: {
    en: "Something went wrong",
    hi: "कुछ गलत हो गया",
  },

  retry: {
    en: "Retry",
    hi: "पुनः प्रयास करें",
  },

  back: {
    en: "Back",
    hi: "वापस",
  },
};

// ======================================================
// 🧠 CONTEXT TYPE
// ======================================================

type I18nContextType = {
  lang: Lang;

  setLang: (lang: Lang) => void;

  t: (key: keyof typeof dict) => string;
};

// ======================================================
// 🌍 CONTEXT
// ======================================================

const I18nCtx =
  createContext<I18nContextType | null>(null);

// ======================================================
// 🌍 PROVIDER
// ======================================================

export function I18nProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved =
      localStorage.getItem("vw_lang") as Lang;

    return saved || "en";
  });

  // ======================================================
  // SAVE LANGUAGE
  // ======================================================

  useEffect(() => {
    localStorage.setItem("vw_lang", lang);

    document.documentElement.lang = lang;
  }, [lang]);

  // ======================================================
  // CHANGE LANGUAGE
  // ======================================================

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
  };

  // ======================================================
  // TRANSLATION FUNCTION
  // ======================================================

  const t = useMemo(
    () => (key: keyof typeof dict) => {
      return (
        dict[key]?.[lang] ??
        dict[key]?.en ??
        String(key)
      );
    },
    [lang]
  );

  return (
    <I18nCtx.Provider
      value={{
        lang,
        setLang,
        t,
      }}
    >
      {children}
    </I18nCtx.Provider>
  );
}

// ======================================================
// 🌍 HOOK
// ======================================================

export function useI18n() {
  const context = useContext(I18nCtx);

  if (!context) {
    throw new Error(
      "useI18n must be used inside I18nProvider"
    );
  }

  return context;
}