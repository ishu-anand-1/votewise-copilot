import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Heart, AlertTriangle } from "lucide-react";
import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import SuggestionChips from "@/components/SuggestionChips";
import { useI18n } from "@/lib/i18n";
import { suggestQuestions } from "@/lib/ai";

const success = [
  { en: "You vote informed", hi: "आप सोच-समझकर वोट देते हैं" },
  { en: "Your colony's roads get fixed", hi: "आपकी कॉलोनी की सड़कें ठीक होती हैं" },
  { en: "Your school gets better teachers", hi: "स्कूल में बेहतर शिक्षक" },
  { en: "Healthcare reaches your area", hi: "हेल्थकेयर आपके इलाक़े तक" },
  { en: "Your voice shapes the next 5 years", hi: "अगले 5 साल आपकी आवाज़ से तय" },
];
const failure = [
  { en: "You skip voting", hi: "आप वोट नहीं देते" },
  { en: "Bad candidate wins by 200 votes", hi: "ख़राब उम्मीदवार 200 वोटों से जीतता है" },
  { en: "Local issues stay ignored", hi: "स्थानीय मुद्दे अनसुने रह जाते हैं" },
  { en: "Corruption rises in your ward", hi: "वार्ड में भ्रष्टाचार बढ़ता है" },
  { en: "You regret it for 5 years", hi: "5 साल पछतावा रहता है" },
];

export default function Twin() {
  const { t, lang } = useI18n();
  return (
    <PageShell>
      <SectionHeader
        eyebrow={<><Sparkles className="w-3.5 h-3.5" /> {lang === "hi" ? "AI सिमुलेशन" : "AI simulation"}</>}
        title={t("t_title")}
        subtitle={t("t_sub")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Success twin */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-6 border-success/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">{lang === "hi" ? "अगर आप वोट देते हैं" : "If you vote"}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Heart className="w-3 h-3 text-success" /> {lang === "hi" ? "बेहतर भविष्य" : "Brighter future"}</div>
              </div>
            </div>
            <ol className="space-y-3 relative ml-2 border-l border-success/30 pl-4">
              {success.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="relative text-sm"
                >
                  <span className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_hsl(var(--success))]" />
                  {s[lang]}
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* Failure twin */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-6 border-destructive/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-destructive/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">{lang === "hi" ? "अगर आप नहीं देते" : "If you don't"}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-destructive" /> {lang === "hi" ? "ख़तरनाक राह" : "Risky path"}</div>
              </div>
            </div>
            <ol className="space-y-3 relative ml-2 border-l border-destructive/30 pl-4">
              {failure.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="relative text-sm"
                >
                  <span className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-destructive" />
                  {s[lang]}
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 glass-strong rounded-3xl p-6 text-center gradient-border relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-aurora opacity-10 animate-aurora" />
        <p className="relative font-display text-xl md:text-2xl font-bold">
          {lang === "hi" ? "एक वोट = 5 साल का असर।" : "One vote = 5 years of impact."}
        </p>
      </motion.div>

      <div className="mt-8">
        <SuggestionChips questions={suggestQuestions("twin")} onPick={(q) => window.dispatchEvent(new CustomEvent("vw:ask", { detail: q }))} />
      </div>
    </PageShell>
  );
}
