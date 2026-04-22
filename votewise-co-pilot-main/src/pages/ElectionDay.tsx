import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Phone, MapPin, Clock } from "lucide-react";
import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import SuggestionChips from "@/components/SuggestionChips";
import { useI18n } from "@/lib/i18n";
import { suggestQuestions } from "@/lib/ai";

const items = [
  { en: "Charge phone the night before", hi: "रात को फ़ोन चार्ज करें" },
  { en: "Carry EPIC / Aadhaar / valid ID", hi: "EPIC / आधार / वैध ID रखें" },
  { en: "Confirm booth on voters.eci.gov.in", hi: "voters.eci.gov.in पर बूथ पुष्टि करें" },
  { en: "Reach booth before 5 PM", hi: "शाम 5 बजे से पहले पहुँचें" },
  { en: "Verify VVPAT slip after voting", hi: "वोट के बाद VVPAT पर्ची देखें" },
  { en: "Show your inked finger online", hi: "स्याही लगी उँगली ऑनलाइन शेयर करें" },
];

export default function ElectionDay() {
  const { t, lang } = useI18n();
  const [done, setDone] = useState<boolean[]>(items.map(() => false));
  const completed = done.filter(Boolean).length;
  const pct = Math.round((completed / items.length) * 100);

  return (
    <PageShell>
      <SectionHeader
        eyebrow={<><Clock className="w-3.5 h-3.5" /> {lang === "hi" ? "लाइव चेकलिस्ट" : "Live checklist"}</>}
        title={t("e_title")}
        subtitle={t("e_sub")}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-6 mb-6 gradient-border relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-aurora opacity-10 animate-aurora" />
        <div className="relative flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-muted-foreground">{lang === "hi" ? "प्रगति" : "Progress"}</div>
            <div className="font-display text-3xl font-extrabold">{pct}%</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">{lang === "hi" ? "पूरे" : "Done"}</div>
            <div className="font-display text-2xl font-bold">{completed}/{items.length}</div>
          </div>
        </div>
        <div className="relative h-2 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${pct}%` }}
            className="h-full bg-gradient-aurora animate-aurora rounded-full"
          />
        </div>
      </motion.div>

      <ul className="space-y-2">
        {items.map((it, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setDone((d) => d.map((v, idx) => (idx === i ? !v : v)))}
              className={`w-full text-left flex items-center gap-3 p-4 rounded-2xl border transition ${
                done[i] ? "border-success/40 bg-success/10" : "border-white/10 glass hover:border-primary/40"
              }`}
            >
              {done[i] ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
              <span className={`text-sm flex-1 ${done[i] ? "line-through text-muted-foreground" : ""}`}>{it[lang]}</span>
            </button>
          </motion.li>
        ))}
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <a href="tel:1950" className="glass rounded-2xl p-4 flex items-center gap-3 hover:border-primary/40 transition">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center"><Phone className="w-5 h-5 text-primary-foreground" /></div>
          <div>
            <div className="font-semibold">1950</div>
            <div className="text-xs text-muted-foreground">{lang === "hi" ? "ECI हेल्पलाइन" : "ECI helpline"}</div>
          </div>
        </a>
        <a href="https://voters.eci.gov.in" target="_blank" rel="noreferrer" className="glass rounded-2xl p-4 flex items-center gap-3 hover:border-primary/40 transition">
          <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center"><MapPin className="w-5 h-5 text-accent-foreground" /></div>
          <div>
            <div className="font-semibold">{lang === "hi" ? "बूथ ढूँढें" : "Find your booth"}</div>
            <div className="text-xs text-muted-foreground">voters.eci.gov.in</div>
          </div>
        </a>
      </div>

      <div className="mt-8">
        <SuggestionChips questions={suggestQuestions("eday")} onPick={(q) => window.dispatchEvent(new CustomEvent("vw:ask", { detail: q }))} />
      </div>
    </PageShell>
  );
}
