import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  align?: "left" | "center";
  gradientTitle?: boolean;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className = "",
  align = "left",
  gradientTitle = false,
}: Props) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className={cn(
        "space-y-3 mb-8",
        isCenter && "text-center items-center",
        className
      )}
    >
      {/* 🔹 EYEBROW */}
      {eyebrow && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0 },
          }}
          className="inline-flex items-center gap-2 chip chip-primary"
        >
          {eyebrow}
        </motion.div>
      )}

      {/* 🔥 TITLE */}
      <motion.h1
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
        className={cn(
          "font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-balance",
          gradientTitle && "bg-gradient-aurora bg-clip-text text-transparent"
        )}
      >
        {title}
      </motion.h1>

      {/* 🧠 SUBTITLE */}
      {subtitle && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className={cn(
            "text-muted-foreground text-base md:text-lg max-w-2xl",
            isCenter && "mx-auto"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}