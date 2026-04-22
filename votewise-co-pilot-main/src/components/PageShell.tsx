import { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import TopNav from "./TopNav";
import ChatBubble from "./ChatBubble";

export default function PageShell({ children }: { children: ReactNode }) {
  const location = useLocation();

  // 🔥 Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* 🌌 PREMIUM BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* blob 1 */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]"
        />

        {/* blob 2 */}
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-accent/20 blur-[140px]"
        />

        {/* blob 3 */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-info/15 blur-[100px]"
        />
      </div>

      {/* NAVBAR */}
      <TopNav />

      {/* 🧠 PAGE CONTENT */}
      <motion.main
        key={location.pathname} // 🔥 enables page transition
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="container max-w-5xl px-4 pt-20 md:pt-24 pb-32 md:pb-12"
      >
        {children}
      </motion.main>

      {/* 🤖 AI CHAT */}
      <ChatBubble />
    </div>
  );
}