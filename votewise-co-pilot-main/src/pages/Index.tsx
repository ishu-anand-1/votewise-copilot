import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Gamepad2, ShieldCheck, Sparkles, CalendarCheck, Vote, Zap, Users, Brain } from "lucide-react";
import PageShell from "@/components/PageShell";
import SuggestionChips from "@/components/SuggestionChips";
import { useI18n } from "@/lib/i18n";
import { suggestQuestions } from "@/lib/ai";

const features = [
  { to: "/dashboard", icon: LayoutDashboard, color: "from-violet-500 to-fuchsia-500", title: { en: "Voter Dashboard", hi: "वोटर डैशबोर्ड" }, desc: { en: "Track readiness & next steps", hi: "तैयारी और अगले कदम" } },
  { to: "/practice", icon: Gamepad2, color: "from-fuchsia-500 to-pink-500", title: { en: "Practice", hi: "अभ्यास" }, desc: { en: "Real scenarios, gamified", hi: "असली परिदृश्य, खेल जैसा" } },
  { to: "/fact-check", icon: ShieldCheck, color: "from-pink-500 to-orange-500", title: { en: "Fact Check", hi: "तथ्य जाँच" }, desc: { en: "Spot fake news instantly", hi: "फ़र्ज़ी ख़बर तुरंत पकड़ें" } },
  { to: "/twin", icon: Sparkles, color: "from-cyan-400 to-blue-500", title: { en: "Voter Twin", hi: "वोटर ट्विन" }, desc: { en: "See futures of your choice", hi: "अपने फ़ैसले के दो भविष्य" } },
  { to: "/election-day", icon: CalendarCheck, color: "from-emerald-400 to-cyan-500", title: { en: "Election Day", hi: "मतदान दिवस" }, desc: { en: "Live booth checklist", hi: "लाइव बूथ चेकलिस्ट" } },
];

const stats = [
  { icon: Users, value: "900M+", label: { en: "Eligible Voters", hi: "योग्य मतदाता" } },
  { icon: Brain, value: "5 min", label: { en: "To Get Ready", hi: "तैयार होने में" } },
  { icon: Zap, value: "100%", label: { en: "Free & Private", hi: "मुफ्त और निजी" } },
];

export default function Index() {
  const { t, lang } = useI18n();
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 chip mb-5"
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>{lang === "hi" ? "लोकसभा चुनाव 2024 के लिए तैयार" : "Built for India · 2024 elections"}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] text-balance"
        >
          {lang === "hi" ? (
            <>
              अपने आस-पास का<br />
              <span className="gradient-text animate-aurora">सबसे समझदार</span> वोटर बनें।
            </>
          ) : (
            <>
              Become the <span className="gradient-text animate-aurora">smartest voter</span><br />
              you know.
            </>
          )}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-base md:text-xl text-muted-foreground max-w-2xl"
        >
          {t("hero_sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-7 flex flex-wrap gap-3"
        >
          <Link to="/dashboard" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-aurora animate-aurora text-primary-foreground font-semibold shadow-glow hover:shadow-elegant transition">
            {t("cta_start")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
          <Link to="/practice" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass font-semibold hover:border-primary/40 transition">
            <Vote className="w-4 h-4 text-primary" />
            {t("cta_demo")}
          </Link>
        </motion.div>

        {/* stats */}
        <div className="mt-10 grid grid-cols-3 gap-3 md:gap-4 max-w-2xl">
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="glass rounded-2xl p-4"
            >
              <s.icon className="w-4 h-4 text-primary mb-2" />
              <div className="font-display text-xl md:text-2xl font-bold">{s.value}</div>
              <div className="text-[11px] md:text-xs text-muted-foreground">{s.label[lang]}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Suggestion chips */}
      <section className="mt-12">
        <SuggestionChips
          questions={suggestQuestions("home")}
          onPick={(q) => {
            // open chat through a custom event would need wiring; simplest: alert via window
            const ev = new CustomEvent("vw:ask", { detail: q });
            window.dispatchEvent(ev);
          }}
          label={lang === "hi" ? "ये सवाल पूछकर शुरू करें" : "Try asking these to start"}
        />
      </section>

      {/* Feature bento */}
      <section className="mt-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-5">
          {lang === "hi" ? "5 सरल कदमों में तैयार" : "Get ready in 5 simple stops"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={f.to}
                className="group glass rounded-3xl p-5 block h-full hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-glow mb-4`}>
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="font-display font-bold text-lg mb-1">{f.title[lang]}</div>
                <div className="text-sm text-muted-foreground">{f.desc[lang]}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition">
                  {lang === "hi" ? "खोलें" : "Open"} <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14">
        <div className="glass-strong rounded-3xl p-6 md:p-10 text-center relative overflow-hidden gradient-border">
          <div className="absolute inset-0 bg-gradient-aurora opacity-10 animate-aurora" />
          <div className="relative">
            <h3 className="font-display text-2xl md:text-3xl font-bold">
              {lang === "hi" ? "तैयार हैं? चलिए शुरू करते हैं।" : "Ready? Let's begin."}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              {lang === "hi" ? "बस 5 मिनट और आप अपने पहले वोट के लिए पूरी तरह तैयार हैं।" : "Just 5 minutes and you're fully prepared for your first vote."}
            </p>
            <Link to="/dashboard" className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-aurora animate-aurora text-primary-foreground font-semibold shadow-glow">
              {t("cta_start")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
