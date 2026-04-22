import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  questions: string[];
  onPick?: (q: string) => void;
  label?: string;
  className?: string;
};

export default function SuggestionChips({
  questions = [],
  onPick,
  label,
  className = "",
}: Props) {
  const { t } = useI18n();

  if (!questions.length) return null; // ✅ safe guard

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06 },
        },
      }}
      className={cn("space-y-2", className)}
    >
      {/* 🔹 LABEL */}
      {label !== "" && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0 },
          }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>{label ?? t("suggested")}</span>
        </motion.div>
      )}

      {/* 🔥 CHIPS */}
      <div className="flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <motion.button
            key={q}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onPick?.(q)}
            className={cn(
              "chip",
              "transition-all duration-200",
              "hover:border-primary/40 hover:shadow-glow",
              "focus:outline-none focus:ring-2 focus:ring-primary/40"
            )}
            type="button"
          >
            {q}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}