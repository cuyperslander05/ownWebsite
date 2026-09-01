"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

import { SITE } from "@/lib/site";

/**
 * Floating assistant that answers visitors' questions about Lander.
 *
 * The model is never called from here — the browser posts to a Cloudflare
 * Worker which holds the API key and the system prompt (see worker/). This
 * component only knows the endpoint's URL, which is public by design.
 *
 * If NEXT_PUBLIC_CHAT_API_URL is not set the widget renders nothing at all,
 * so the site works exactly as before until the Worker is deployed.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_CHAT_API_URL;

/** Matches the Worker's own cap, so over-long input is caught before the round trip. */
const MAX_CHARS = 1000;

const INTRO =
  `Hi! I'm ${SITE.firstName}'s AI assistant. Ask me about his experience, ` +
  `studies, skills or projects — I only answer from his CV, so for anything ` +
  `else I'll point you to his email.`;

const SUGGESTIONS = [
  "What has he worked on?",
  "Which languages does he code in?",
  "Is he available for hire?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-[var(--awrs-primary)] text-white"
            : "rounded-bl-sm bg-[var(--awrs-bg-secondary)] text-[var(--awrs-text)]"
        }`}
      >
        {message.content}
      </p>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start" aria-hidden="true">
      <span className="flex gap-1 rounded-2xl rounded-bl-sm bg-[var(--awrs-bg-secondary)] px-3.5 py-3">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="awrs-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--awrs-text-tertiary)]"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!ENDPOINT) return null;

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || pending) return;

    // The reply is generated from the conversation as the server sees it, so
    // the new question has to be part of what gets posted.
    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setError(null);
    setPending(true);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Could not reach the assistant. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close the assistant" : "Ask the assistant about Lander"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--awrs-primary)] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--awrs-primary)]"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Assistant"
          className="fixed bottom-24 right-6 z-50 flex h-[520px] max-h-[calc(100vh-8rem)] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-[var(--awrs-border)] bg-[var(--awrs-card)] shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-[var(--awrs-border)] px-4 py-3">
            <div>
              <p className="text-sm font-bold">Ask about {SITE.firstName}</p>
              {/* Said plainly: nobody should think they are talking to Lander. */}
              <p className="text-xs text-[var(--awrs-text-tertiary)]">
                AI assistant · answers from his CV
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the assistant"
              className="-mr-1 rounded-lg p-1 text-[var(--awrs-text-tertiary)] transition-colors hover:bg-[var(--awrs-bg-secondary)] hover:text-[var(--awrs-text)]"
            >
              <X size={16} />
            </button>
          </div>

          <div
            ref={logRef}
            aria-live="polite"
            className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            <Bubble message={{ role: "assistant", content: INTRO }} />
            {messages.map((message, index) => (
              <Bubble key={index} message={message} />
            ))}
            {pending && <TypingDots />}
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
            )}

            {messages.length === 0 && !pending && (
              <div className="mt-1 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-[var(--awrs-border)] px-3 py-1.5 text-xs text-[var(--awrs-text-secondary)] transition-colors hover:border-[var(--awrs-primary)] hover:text-[var(--awrs-primary)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-[var(--awrs-border)] px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, MAX_CHARS))}
              placeholder="Ask a question…"
              aria-label="Your question"
              maxLength={MAX_CHARS}
              className="min-w-0 flex-1 rounded-xl bg-[var(--awrs-bg-secondary)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--awrs-text-tertiary)] focus:ring-2 focus:ring-[var(--awrs-primary)]/40"
            />
            <button
              type="submit"
              disabled={pending || input.trim() === ""}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--awrs-primary)] text-white transition-opacity disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>

          <p className="px-4 pb-3 text-center text-[10px] leading-tight text-[var(--awrs-text-tertiary)]">
            AI-generated. For anything important, email{" "}
            <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">
              {SITE.email}
            </a>
          </p>
        </div>
      )}
    </>
  );
}
