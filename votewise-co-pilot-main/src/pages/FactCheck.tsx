import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  ShieldX,
  Loader2,
  Brain,
  Sparkles,
  Shield,
} from "lucide-react";

import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import SuggestionChips from "@/components/SuggestionChips";

import { useI18n } from "@/lib/i18n";
import { suggestQuestions } from "@/lib/ai";
import { factCheckAPI } from "@/lib/api";

// ======================================================
// TYPES
// ======================================================

type Verdict =
  | "true"
  | "false"
  | "misleading"
  | "unverified";

type Source =
  | "rule_based"
  | "ml_model"
  | "gemini_ai"
  | "fallback"
  | "unknown";

type FactResult = {
  verdict: Verdict;
  confidence: number;
  reason: string;
  source?: Source;
};

// ======================================================
// CONFIG
// ======================================================

const config: Record<
  Verdict,
  {
    icon: any;
    color: string;
    en: string;
    hi: string;
  }
> = {
  true: {
    icon: ShieldCheck,
    color:
      "text-success border-success/40 bg-success/10",

    en: "Likely True",
    hi: "संभवतः सही",
  },

  false: {
    icon: ShieldX,

    color:
      "text-destructive border-destructive/40 bg-destructive/10",

    en: "Likely False",
    hi: "संभवतः गलत",
  },

  misleading: {
    icon: ShieldAlert,

    color:
      "text-warning border-warning/40 bg-warning/10",

    en: "Misleading",
    hi: "भ्रामक",
  },

  unverified: {
    icon: ShieldQuestion,

    color:
      "text-info border-info/40 bg-info/10",

    en: "Unverified",
    hi: "अप्रमाणित",
  },
};

// ======================================================
// SAMPLE CLAIMS
// ======================================================

const samples = [
  {
    en: "Government secretly giving ₹5000 for votes",

    hi: "सरकार वोट के बदले ₹5000 दे रही है",
  },

  {
    en: "Election Commission launched voter registration portal",

    hi: "चुनाव आयोग ने वोटर पोर्टल लॉन्च किया",
  },

  {
    en: "Secret online voting website launched",

    hi: "गुप्त ऑनलाइन वोटिंग वेबसाइट लॉन्च हुई",
  },
];

// ======================================================
// SOURCE BADGE
// ======================================================

function getSourceInfo(source?: string) {
  switch (source) {
    case "ml_model":
      return {
        label: "🧠 ML Model",
        icon: Brain,
      };

    case "rule_based":
      return {
        label: "🛡 Rule Engine",
        icon: Shield,
      };

    case "gemini_ai":
      return {
        label: "✨ Google Gemini AI",
        icon: Sparkles,
      };

    default:
      return {
        label: "Unknown Engine",
        icon: ShieldQuestion,
      };
  }
}

// ======================================================
// COMPONENT
// ======================================================

export default function FactCheck() {
  const { t, lang } = useI18n();

  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<FactResult | null>(
      null
    );

  // ======================================================
  // CHECK CLAIM
  // ======================================================

  async function checkClaim() {
    if (!text.trim()) return;

    setLoading(true);

    setResult(null);

    try {
      const response =
        await factCheckAPI(text) as any;

      const parsed =
        typeof response?.result ===
        "string"
          ? JSON.parse(
              response.result
            )
          : response?.result || {
              verdict:
                "unverified",

              confidence: 0,

              reason:
                "No response returned",

              source:
                "unknown",
            };

      setResult({
        verdict:
          parsed.verdict ||
          "unverified",

        confidence:
          Number(
            parsed.confidence
          ) || 0,

        reason:
          parsed.reason ||
          "Unable to verify claim.",

        source:
          parsed.source ||
          "unknown",
      });
    } catch (error) {
      console.error(
        "Fact Check Error:",
        error
      );

      setResult({
        verdict:
          "unverified",

        confidence: 0,

        reason:
          "Unable to verify claim right now.",

        source:
          "unknown",
      });
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <PageShell>

      <SectionHeader
        eyebrow={
          lang === "hi"
            ? "AI सत्यापन"
            : "AI Verification"
        }
        title={t("fc_title")}
        subtitle={t("fc_sub")}
      />

      {/* INPUT */}

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          glass-strong
          rounded-3xl
          p-5
          gradient-border
        "
      >
        <textarea
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder={t("fc_paste")}
          className="
            w-full
            h-36
            bg-transparent
            border
            border-white/10
            rounded-2xl
            p-4
            text-sm
            resize-none
            focus:outline-none
            focus:border-primary/50
          "
        />

        {/* BUTTONS */}

        <div className="mt-4 flex flex-wrap gap-2 items-center">

          <motion.button
            whileTap={{
              scale: 0.97,
            }}
            whileHover={{
              scale: 1.02,
            }}
            onClick={
              checkClaim
            }
            disabled={
              loading ||
              !text.trim()
            }
            className="
              px-5
              py-2.5
              rounded-full
              bg-gradient-aurora
              text-primary-foreground
              font-semibold
              flex
              items-center
              gap-2
              shadow-glow
              disabled:opacity-50
            "
          >

            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}

            {loading
              ? "Checking..."
              : t("fc_check")}
          </motion.button>

          <span className="text-xs text-muted-foreground">
            Try sample claims:
          </span>

          {samples.map(
            (
              sample,
              i
            ) => (
              <button
                key={i}
                onClick={() =>
                  setText(
                    sample[
                      lang
                    ]
                  )
                }
                className="chip text-xs"
              >
                {sample[
                  lang
                ].slice(
                  0,
                  28
                )}
                ...
              </button>
            )
          )}
        </div>
      </motion.div>

      {/* RESULT */}

      <AnimatePresence>

        {result && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            className={`
              mt-6
              rounded-3xl
              border
              p-5
              ${config[result.verdict].color}
            `}
          >

            <div className="flex gap-4">

              {/* ICON */}

              {(() => {

                const Icon =
                  config[
                    result
                      .verdict
                  ].icon;

                return (
                  <Icon className="w-7 h-7 shrink-0" />
                );
              })()}

              {/* CONTENT */}

              <div className="flex-1">

                <div className="flex flex-wrap gap-2 items-center">

                  <h3 className="font-bold text-xl">

                    {
                      config[
                        result
                          .verdict
                      ][lang]
                    }

                  </h3>

                  <span className="chip text-xs">

                    {
                      result.confidence
                    }
                    % confidence

                  </span>

                </div>

                <p className="mt-3 text-sm leading-relaxed">

                  {result.reason}

                </p>

                {/* ENGINE */}

                <div className="mt-4">

                  <div className="text-xs opacity-70 mb-1">

                    Detection Engine

                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/10 text-sm">

                    {
                      getSourceInfo(
                        result.source
                      ).label
                    }

                  </div>

                </div>

              </div>

            </div>

            {/* CONFIDENCE BAR */}

            <div className="mt-5 h-2 rounded-full overflow-hidden bg-black/20">

              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${result.confidence}%`,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="
                  h-full
                  bg-current
                  opacity-70
                "
              />

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* SUGGESTIONS */}

      <div className="mt-8">

        <SuggestionChips
          questions={suggestQuestions(
            "detector"
          )}
          onPick={(q) =>
            setText(q)
          }
        />

      </div>

    </PageShell>
  );
}