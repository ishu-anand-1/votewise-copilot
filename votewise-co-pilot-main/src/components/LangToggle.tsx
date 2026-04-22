import { useState, useRef, useEffect } from "react";
import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

export default function LangToggle() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔥 Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // 🔥 Close on ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass rounded-full px-3 py-2 flex items-center gap-2 text-sm font-medium hover:border-primary/40 transition"
        aria-label="Change language"
      >
        <Languages className="w-4 h-4 text-primary" />
        <span className="font-semibold">
          {lang === "en" ? "EN" : "हिं"}
        </span>
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-44 glass-strong rounded-2xl p-2 z-50 shadow-xl border border-white/10"
          >
            {(["en", "hi"] as const).map((l) => {
              const active = lang === l;

              return (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition ${
                    active
                      ? "bg-gradient-primary text-primary-foreground"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span>
                    {l === "en" ? "🇬🇧 English" : "🇮🇳 हिन्दी"}
                  </span>

                  {active && (
                    <span className="text-xs opacity-80">✔</span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}