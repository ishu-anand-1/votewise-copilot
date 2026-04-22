import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, Trophy, TrendingUp } from "lucide-react";
import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import SuggestionChips from "@/components/SuggestionChips";
import { useI18n } from "@/lib/i18n";
import { suggestQuestions } from "@/lib/ai";

const journey = [
  { done: true, en: "Registered to vote", hi: "वोट के लिए पंजीकरण" },
  { done: true, en: "Found your booth", hi: "अपना बूथ ढूँढा" },
  { done: false, en: "Researched candidates", hi: "उम्मीदवारों की जाँच" },
  { done: false, en: "Practiced 1 scenario", hi: "1 परिदृश्य का अभ्यास" },
  { done: false, en: "Election Day checklist", hi: "मतदान दिवस चेकलिस्ट" },
];

export default function Dashboard() {
  const { t, lang } = useI18n();
  const completed = journey.filter((j) => j.done).length;
  const readiness = Math.round((completed / journey.length) * 100);
  const score = 720;
  const sparkData = [40, 55, 50, 65, 60, 75, 72];

  return (
    <PageShell>
      <SectionHeader
        eyebrow={lang === "hi" ? "आपकी प्रगति" : "Your progress"}
        title={t("d_title")}
        subtitle={t("d_sub")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Readiness ring */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 glass rounded-3xl p-6 flex flex-col items-center justify-center"
        >
          <div className="relative w-44 h-44">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" stroke="hsl(var(--secondary))" strokeWidth="10" fill="none" />
              <motion.circle
                cx="60" cy="60" r="52"
                stroke="url(#aurora)" strokeWidth="10" fill="none" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - readiness / 100) }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="aurora" x1="0" x2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--info))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-4xl font-extrabold gradient-text">{readiness}%</div>
              <div className="text-xs text-muted-foreground mt-1">{t("d_readiness")}</div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {lang === "hi" ? `${completed}/${journey.length} कदम पूरे` : `${completed}/${journey.length} steps complete`}
          </div>
        </motion.div>

        {/* Voter score */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="md:col-span-2 glass rounded-3xl p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Trophy className="w-3.5 h-3.5 text-warning" /> {t("d_score")}
              </div>
              <div className="font-display text-5xl font-extrabold mt-1">{score}</div>
              <div className="flex items-center gap-1 text-success text-sm mt-1">
                <TrendingUp className="w-4 h-4" /> +48 {lang === "hi" ? "इस सप्ताह" : "this week"}
              </div>
            </div>
            <div className="chip chip-primary">{lang === "hi" ? "गोल्ड टियर" : "Gold tier"}</div>
          </div>
          {/* sparkline */}
          <svg viewBox="0 0 200 60" className="w-full h-20 mt-4">
            <defs>
              <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * 200},${60 - (v / 100) * 50}`).join(" ")}
            />
            <polygon
              fill="url(#spark)"
              points={`0,60 ${sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * 200},${60 - (v / 100) * 50}`).join(" ")} 200,60`}
            />
          </svg>
        </motion.div>

        {/* Next step CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-3 glass-strong rounded-3xl p-6 relative overflow-hidden gradient-border"
        >
          <div className="absolute inset-0 bg-gradient-aurora opacity-10 animate-aurora" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">{t("d_next")}</div>
              <div className="font-display text-xl md:text-2xl font-bold">
                {lang === "hi" ? "एक अभ्यास परिदृश्य पूरा करें" : "Complete one practice scenario"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">+80 {lang === "hi" ? "स्कोर" : "score"} · 3 min</div>
            </div>
            <Link to="/practice" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-glow self-start md:self-auto">
              {lang === "hi" ? "शुरू करें" : "Start"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Journey timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="md:col-span-3 glass rounded-3xl p-6"
        >
          <div className="font-display font-bold text-lg mb-4">{t("d_journey")}</div>
          <ol className="space-y-3">
            {journey.map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                {step.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <span className={`${step.done ? "line-through text-muted-foreground" : ""}`}>{step[lang]}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>

      <div className="mt-8">
        <SuggestionChips questions={suggestQuestions("dashboard")} onPick={(q) => window.dispatchEvent(new CustomEvent("vw:ask", { detail: q }))} />
      </div>
    </PageShell>
  );
}
