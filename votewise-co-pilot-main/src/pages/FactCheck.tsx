import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  ShieldX,
  Loader2,
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

type FactResult = {
  verdict: Verdict;
  confidence: number;
  reason: string;
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
    en: "Forwarded: Every voter will get ₹2000 reward after voting!",

    hi: "फॉरवर्ड: हर वोटर को वोट देने के बाद ₹2000 मिलेंगे!",
  },

  {
    en: "ECI launched a portal for voter ID verification.",

    hi: "ECI ने वोटर ID जांचने के लिए पोर्टल लॉन्च किया।",
  },
];

// ======================================================
// COMPONENT
// ======================================================

export default function FactCheck() {
  const { t, lang } = useI18n();

  const [text, setText] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<FactResult | null>(null);

  // ======================================================
  // CHECK CLAIM
  // ======================================================

  async function checkClaim() {
    if (!text.trim()) return;

    setLoading(true);

    setResult(null);

    try {
      const response =
        await factCheckAPI(text) as { result?: any };

     const parsed: FactResult =
  typeof response?.result === "string"
    ? JSON.parse(response.result)
    : response?.result || {
        verdict: "unverified",
        confidence: 0,
        reason: "No response returned",
      };

setResult({
  verdict: parsed.verdict || "unverified",

  confidence:
    Number(parsed.confidence) || 0,

  reason:
    parsed.reason ||
    "Unable to verify this claim.",
});
    } catch (error) {
      console.error(
        "Fact Check Error:",
        error
      );

      setResult({
        verdict: "unverified",

        confidence: 0,

        reason:
          "Unable to verify claim right now.",
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
      {/* HEADER */}

      <SectionHeader
        eyebrow={
          lang === "hi"
            ? "AI सत्यापन"
            : "AI Verification"
        }
        title={t("fc_title")}
        subtitle={t("fc_sub")}
        gradientTitle
      />

      {/* INPUT CARD */}

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="glass-strong rounded-3xl p-5 gradient-border"
      >
        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value)
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
            placeholder:text-muted-foreground
          "
        />

        {/* ACTIONS */}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <motion.button
            whileTap={{
              scale: 0.96,
            }}
            whileHover={{
              scale: 1.02,
            }}
            onClick={checkClaim}
            disabled={
              !text.trim() || loading
            }
            className="
              inline-flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-full
              bg-gradient-aurora
              animate-aurora
              text-primary-foreground
              font-semibold
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
              ? lang === "hi"
                ? "जांच हो रही है..."
                : "Checking..."
              : t("fc_check")}
          </motion.button>

          {/* SAMPLE LABEL */}

          <span className="text-xs text-muted-foreground">
            {lang === "hi"
              ? "या उदाहरण आज़माएँ:"
              : "Try sample claims:"}
          </span>

          {/* SAMPLE BUTTONS */}

          {samples.map((sample, i) => (
            <button
              key={i}
              onClick={() =>
                setText(sample[lang])
              }
              className="
                chip
                text-[11px]
                hover:border-primary/40
                transition
              "
            >
              {sample[lang].slice(
                0,
                32
              )}
              ...
            </button>
          ))}
        </div>
      </motion.div>

      {/* RESULT */}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 16,
            }}
            className={`
              mt-6
              rounded-3xl
              border
              p-5
              ${config[result.verdict].color}
            `}
          >
            <div className="flex items-start gap-4">
              {/* ICON */}

              {(() => {
                const Icon =
                  config[
                    result.verdict
                  ].icon;

                return (
                  <Icon className="w-7 h-7 shrink-0" />
                );
              })()}

              {/* CONTENT */}

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-bold">
                    {
                      config[
                        result.verdict
                      ][lang]
                    }
                  </h3>

                  <span className="chip text-[11px] border-current/30">
                    {
                      result.confidence
                    }
                    %{" "}
                    {lang === "hi"
                      ? "विश्वास"
                      : "confidence"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed">
                  {result.reason}
                </p>
              </div>
            </div>

            {/* CONFIDENCE BAR */}

            <div className="mt-5 h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${result.confidence}%`,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="h-full bg-current opacity-70"
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