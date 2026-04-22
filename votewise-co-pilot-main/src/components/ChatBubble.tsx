import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { suggestQuestions } from "@/lib/ai";
import SuggestionChips from "./SuggestionChips";
import { useLocation } from "react-router-dom";
import { chatAPI } from "@/lib/api";

type Msg = {
  role: "user" | "ai";
  text: any; // ✅ allow object or string
};

function contextFromPath(pathname: string): string {
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/practice")) return "simulation";
  if (pathname.startsWith("/fact-check")) return "detector";
  if (pathname.startsWith("/twin")) return "twin";
  if (pathname.startsWith("/election-day")) return "eday";
  return "home";
}

export default function ChatBubble() {
  const { t, lang } = useI18n();
  const loc = useLocation();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text:
        lang === "hi"
          ? "नमस्ते! मैं आपकी VoteWise सहायक हूँ। कुछ भी पूछें।"
          : "Hi! I'm your VoteWise co-pilot. Ask me anything.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const ctx = contextFromPath(loc.pathname);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, typing]);

  useEffect(() => {
    function onAsk(e: Event) {
      const q = (e as CustomEvent<string>).detail;
      if (!q) return;
      setOpen(true);
      setTimeout(() => send(q), 250);
    }
    window.addEventListener("vw:ask", onAsk);
    return () => window.removeEventListener("vw:ask", onAsk);
  }, []);

  async function send(text: string) {
    if (!text.trim()) return;

    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      const res = await chatAPI(text);

      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: res, // ✅ store full response
        },
      ]);
    } catch (err) {
      setMsgs((m) => [
        ...m,
        { role: "ai", text: "⚠️ Error connecting to AI" },
      ]);
    }

    setTyping(false);
  }

  // 🔥 SAFE RENDER FUNCTION
  function formatMessage(content: any): string {
    if (!content) return "No response";

    if (typeof content === "string") return content;

    if (content.title && content.steps) {
      return `**${content.title}**\n\n${content.steps
        .map((s: string) => `• ${s}`)
        .join("\n")}`;
    }

    if (content.response) return content.response;

    return JSON.stringify(content);
  }

  return (
    <>
      {/* FLOAT BUTTON */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-gradient-aurora flex items-center justify-center shadow-elegant"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 w-[380px] h-[550px] glass-strong rounded-3xl flex flex-col z-50"
          >
            {/* HEADER */}
            <div className="flex justify-between p-3 border-b">
              <div className="flex gap-2 items-center">
                <Sparkles />
                <span>{t("ask_ai")}</span>
              </div>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            {/* MESSAGES */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
              {msgs.map((m, i) => {
                const text = formatMessage(m.text);

                return (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="p-3 rounded-xl bg-white/5 text-sm max-w-[80%]">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: text
                            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br>"),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INPUT */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 rounded-full bg-white/5"
                placeholder={t("ask_placeholder")}
              />
              <button type="submit">
                <Send />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}