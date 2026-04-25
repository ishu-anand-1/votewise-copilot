import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  Brain,
  Shield,
  Bot,
} from "lucide-react";

import {
  useLocation,
} from "react-router-dom";

import {
  useI18n,
} from "@/lib/i18n";

import {
  suggestQuestions,
} from "@/lib/ai";

import SuggestionChips from "./SuggestionChips";

import {
  chatAPI,
} from "@/lib/api";

// ======================================================
// TYPES
// ======================================================

type Msg = {

  role:
    | "user"
    | "ai";

  text: any;
};

// ======================================================
// CONTEXT
// ======================================================

function contextFromPath(
  pathname: string
): string {

  if (
    pathname.startsWith(
      "/dashboard"
    )
  )
    return "dashboard";

  if (
    pathname.startsWith(
      "/practice"
    )
  )
    return "simulation";

  if (
    pathname.startsWith(
      "/fact-check"
    )
  )
    return "detector";

  if (
    pathname.startsWith(
      "/twin"
    )
  )
    return "twin";

  if (
    pathname.startsWith(
      "/election-day"
    )
  )
    return "eday";

  return "home";
}

// ======================================================
// FORMAT MESSAGE
// ======================================================

function formatMessage(
  content: any
): string {

  if (!content)
    return "No response";

  // string

  if (
    typeof content ===
    "string"
  ) {
    return content;
  }

  // structured response

  if (
    content.title &&
    content.steps
  ) {

    return `**${content.title}**\n\n${content.steps
      .map(
        (
          s: string
        ) => `• ${s}`
      )
      .join("\n")}`;
  }

  // generic response

  if (
    content.response
  ) {
    return content.response;
  }

  // fallback

  return JSON.stringify(
    content,
    null,
    2
  );
}

// ======================================================
// COMPONENT
// ======================================================

export default function ChatBubble() {

  const {
    t,
    lang,
  } = useI18n();

  const loc =
    useLocation();

  const ctx =
    contextFromPath(
      loc.pathname
    );

  // ======================================================
  // STATE
  // ======================================================

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    input,
    setInput,
  ] = useState("");

  const [
    typing,
    setTyping,
  ] = useState(false);

  const [
    msgs,
    setMsgs,
  ] = useState<Msg[]>([
    {
      role: "ai",

      text:
        lang === "hi"
          ? "नमस्ते! मैं आपकी VoteWise सहायक हूँ। कुछ भी पूछें।"
          : "Hi! I'm your VoteWise co-pilot. Ask me anything.",
    },
  ]);

  const scrollRef =
    useRef<HTMLDivElement>(
      null
    );

  // ======================================================
  // AUTO SCROLL
  // ======================================================

  useEffect(() => {

    scrollRef.current?.scrollTo({

      top:
        scrollRef.current
          .scrollHeight,

      behavior:
        "smooth",
    });

  }, [
    msgs,
    typing,
  ]);

  // ======================================================
  // GLOBAL ASK EVENT
  // ======================================================

  useEffect(() => {

    function onAsk(
      e: Event
    ) {

      const q =
        (
          e as CustomEvent<string>
        ).detail;

      if (!q) return;

      setOpen(true);

      setTimeout(
        () => send(q),
        300
      );
    }

    window.addEventListener(
      "vw:ask",
      onAsk
    );

    return () =>
      window.removeEventListener(
        "vw:ask",
        onAsk
      );

  }, []);

  // ======================================================
  // SEND MESSAGE
  // ======================================================

  async function send(
    text: string
  ) {

    if (
      !text.trim()
    )
      return;

    // user msg

    setMsgs(
      (m) => [
        ...m,

        {
          role: "user",

          text,
        },
      ]
    );

    setInput("");

    setTyping(true);

    try {

      const res =
        await chatAPI(
          text
        );

      setMsgs(
        (m) => [
          ...m,

          {
            role: "ai",

            text: res,
          },
        ]
      );

    } catch (
      error
    ) {

      console.error(
        error
      );

      setMsgs(
        (m) => [
          ...m,

          {
            role: "ai",

            text:
              "⚠️ Error connecting to AI",
          },
        ]
      );

    } finally {

      setTyping(false);

    }
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <>

      {/* FLOAT BUTTON */}

      <motion.button

        initial={{
          scale: 0,
        }}

        animate={{
          scale: 1,
        }}

        transition={{
          type: "spring",
          delay: 0.5,
        }}

        onClick={() =>
          setOpen(
            true
          )
        }

        className="
          fixed
          bottom-24
          md:bottom-6
          right-4
          md:right-6
          z-40
          w-14
          h-14
          rounded-full
          bg-gradient-aurora
          flex
          items-center
          justify-center
          shadow-elegant
        "
      >

        <MessageCircle className="w-6 h-6 text-white" />

      </motion.button>

      {/* CHAT WINDOW */}

      <AnimatePresence>

        {open && (

          <motion.div

            initial={{
              opacity: 0,
              y: 30,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: 30,
            }}

            className="
              fixed
              bottom-4
              right-4
              w-[95vw]
              md:w-[390px]
              h-[80vh]
              md:h-[600px]
              glass-strong
              rounded-3xl
              flex
              flex-col
              z-50
              overflow-hidden
            "
          >

            {/* HEADER */}

            <div className="
              flex
              items-center
              justify-between
              p-4
              border-b
              border-white/10
            ">

              <div className="
                flex
                items-center
                gap-2
              ">

                <Sparkles className="w-5 h-5 text-primary" />

                <span className="font-semibold">

                  {t("ask_ai")}

                </span>

              </div>

              <button
                onClick={() =>
                  setOpen(
                    false
                  )
                }
              >

                <X />

              </button>

            </div>

            {/* MESSAGES */}

            <div

              ref={scrollRef}

              className="
                flex-1
                overflow-y-auto
                p-4
                space-y-3
              "
            >

              {msgs.map(
                (
                  m,
                  i
                ) => {

                  const text =
                    formatMessage(
                      m.text
                    );

                  return (

                    <div

                      key={i}

                      className={`
                        flex
                        ${
                          m.role ===
                          "user"

                            ? "justify-end"

                            : "justify-start"
                        }
                      `}
                    >

                      <div

                        className={`
                          max-w-[85%]
                          rounded-2xl
                          px-4
                          py-3
                          text-sm
                          whitespace-pre-wrap
                          ${
                            m.role ===
                            "user"

                              ? `
                                bg-primary
                                text-white
                              `

                              : `
                                bg-white/5
                                border
                                border-white/10
                              `
                          }
                        `}
                      >

                        <div

                          dangerouslySetInnerHTML={{
                            __html:
                              text

                                .replace(
                                  /\*\*(.+?)\*\*/g,

                                  "<strong>$1</strong>"
                                )

                                .replace(
                                  /\n/g,

                                  "<br>"
                                ),
                          }}

                        />

                      </div>

                    </div>

                  );
                }
              )}

              {/* TYPING */}

              {typing && (

                <div className="flex justify-start">

                  <div className="
                    bg-white/5
                    border
                    border-white/10
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    flex
                    items-center
                    gap-2
                  ">

                    <Loader2 className="
                      w-4
                      h-4
                      animate-spin
                    " />

                    AI thinking...

                  </div>

                </div>

              )}

            </div>

            {/* SUGGESTIONS */}

            <div className="
              px-3
              pb-2
            ">

              <SuggestionChips

                questions={suggestQuestions(
                  ctx
                ).slice(
                  0,
                  3
                )}

                onPick={(
                  q
                ) =>
                  send(q)
                }

              />

            </div>

            {/* INPUT */}

            <form

              onSubmit={(
                e
              ) => {

                e.preventDefault();

                send(
                  input
                );
              }}

              className="
                p-3
                border-t
                border-white/10
                flex
                gap-2
              "
            >

              <input

                value={input}

                onChange={(
                  e
                ) =>
                  setInput(
                    e.target
                      .value
                  )
                }

                placeholder={t(
                  "ask_placeholder"
                )}

                className="
                  flex-1
                  rounded-full
                  bg-white/5
                  border
                  border-white/10
                  px-4
                  py-2
                  text-sm
                  focus:outline-none
                "
              />

              <button

                type="submit"

                disabled={
                  !input.trim()
                }

                className="
                  w-11
                  h-11
                  rounded-full
                  bg-primary
                  flex
                  items-center
                  justify-center
                  disabled:opacity-50
                "
              >

                <Send className="
                  w-4
                  h-4
                  text-white
                " />

              </button>

            </form>

          </motion.div>

        )}

      </AnimatePresence>

    </>
  );
}