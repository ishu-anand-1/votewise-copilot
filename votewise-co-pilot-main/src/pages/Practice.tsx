import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  CheckCircle2,
  XCircle,
  Trophy,
  RefreshCw,
  Loader2,
} from "lucide-react";

import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import SuggestionChips from "@/components/SuggestionChips";

import { useI18n } from "@/lib/i18n";
import { suggestQuestions } from "@/lib/ai";
import { scenarioAPI } from "@/lib/api";

// ======================================================
// TYPES
// ======================================================

type Choice = {
  en: string;
  hi: string;
  good: boolean;

  feedback: {
    en: string;
    hi: string;
  };
};

type Scenario = {
  id: string;

  title: {
    en: string;
    hi: string;
  };

  prompt: {
    en: string;
    hi: string;
  };

  choices: Choice[];
};

// ======================================================
// COMPONENT
// ======================================================

export default function Practice() {
  const { t, lang } = useI18n();

  const [active, setActive] =
    useState<Scenario | null>(null);

  const [picked, setPicked] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [completed, setCompleted] =
    useState<string[]>([]);

  const [loadingScenario, setLoadingScenario] =
    useState(false);

  // ======================================================
  // PICK ANSWER
  // ======================================================

  function pick(i: number) {
    if (picked !== null || !active)
      return;

    setPicked(i);

    if (active.choices[i].good) {
      setScore((prev) => prev + 50);
    }
  }

  // ======================================================
  // NEXT SCENARIO
  // ======================================================

  function next() {
    if (active) {
      setCompleted((prev) => [
        ...prev,
        active.id,
      ]);
    }

    setActive(null);

    setPicked(null);
  }

  // ======================================================
  // LOAD SCENARIO
  // ======================================================

  async function loadScenario(
    type = "first-time voter"
  ) {
    try {
      setLoadingScenario(true);

      const res =
        await scenarioAPI(type);

      const parsed =
        typeof res?.scenario ===
        "string"
          ? JSON.parse(
              res.scenario
            )
          : res?.scenario;

      if (!parsed) return;

      const formatted: Scenario =
        {
          id:
            crypto.randomUUID(),

          title: {
            en:
              parsed.title ||
              "Scenario",

            hi:
              parsed.title ||
              "परिदृश्य",
          },

          prompt: {
            en:
              parsed.situation ||
              "No situation",

            hi:
              parsed.situation ||
              "कोई स्थिति नहीं",
          },

          choices:
            parsed.choices?.map(
              (c: any) => ({
                en: c.text,

                hi: c.text,

                good:
                  c.correct,

                feedback: {
                  en:
                    c.explanation,

                  hi:
                    c.explanation,
                },
              })
            ) || [],
        };

      setPicked(null);

      setActive(formatted);
    } catch (err) {
      console.error(
        "Scenario Error:",
        err
      );
    } finally {
      setLoadingScenario(false);
    }
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Gamified"
        title={t("s_title")}
        subtitle={t("s_sub")}
      />

      {/* SCORE */}

      <div className="mb-6 flex items-center justify-between">
        <div className="glass rounded-2xl px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Score
          </div>

          <div className="flex items-center gap-2 text-2xl font-bold">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {score}
          </div>
        </div>

        <div className="glass rounded-2xl px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Completed
          </div>

          <div className="text-2xl font-bold">
            {completed.length}
          </div>
        </div>
      </div>

      {/* START BUTTON */}

      <button
        onClick={() =>
          loadScenario()
        }
        disabled={
          loadingScenario
        }
        className="
          btn
          flex
          items-center
          gap-2
          mb-6
        "
      >
        {loadingScenario ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Start AI Scenario
          </>
        )}
      </button>

      {/* SUGGESTIONS */}

      <SuggestionChips
        questions={suggestQuestions(
          "simulation"
        )}
        onPick={(q) =>
          loadScenario(q)
        }
      />

      {/* MODAL */}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-50
              bg-black/60
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
          >
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              className="
                glass-strong
                rounded-3xl
                p-6
                max-w-2xl
                w-full
              "
            >
              {/* TITLE */}

              <h2 className="text-2xl font-bold mb-4">
                {
                  active.title[
                    lang
                  ]
                }
              </h2>

              {/* PROMPT */}

              <p className="text-muted-foreground mb-6">
                {
                  active.prompt[
                    lang
                  ]
                }
              </p>

              {/* CHOICES */}

              <div className="space-y-3">
                {active.choices.map(
                  (
                    choice,
                    i
                  ) => {
                    const selected =
                      picked === i;

                    return (
                      <button
                        key={i}
                        onClick={() =>
                          pick(i)
                        }
                        disabled={
                          picked !==
                          null
                        }
                        className={`
                          w-full
                          text-left
                          p-4
                          rounded-2xl
                          border
                          transition

                          ${
                            selected
                              ? choice.good
                                ? "border-green-500 bg-green-500/10"
                                : "border-red-500 bg-red-500/10"
                              : "border-white/10 hover:border-primary/40"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span>
                            {
                              choice[
                                lang
                              ]
                            }
                          </span>

                          {selected &&
                            (choice.good ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                            ))}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              {/* FEEDBACK */}

              {picked !==
                null && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    mt-6
                    p-4
                    rounded-2xl
                    bg-white/5
                  "
                >
                  <p className="mb-4">
                    {
                      active
                        .choices[
                        picked
                      ]
                        .feedback[
                        lang
                      ]
                    }
                  </p>

                  <button
                    onClick={
                      next
                    }
                    className="
                      btn
                    "
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}