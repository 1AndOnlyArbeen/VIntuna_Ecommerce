import { useState, useRef, useEffect } from "react"
import { sendChatMessageAPI } from "../api"

// ──────────────────────────────────────────────
// HOW THIS COMPONENT WORKS:
//
// 1. Floating chat button (bottom-right corner)
// 2. Click → opens chat panel ("Vinny" the AI assistant)
// 3. User types message → sends to POST /api/v1/chat
// 4. Backend searches MongoDB products → asks the local AI
// 5. AI response displayed in chat bubble
// 6. Full conversation history is sent each time so the AI
//    remembers what was discussed earlier
// ──────────────────────────────────────────────

const GREETING =
  "Namaste! 👋 I'm Vinny, your VintunaStore shopping assistant. Ask me about products, prices, offers or delivery!"

const SUGGESTIONS = [
  "What's on offer today?",
  "Show me spices under Rs.200",
  "Do you deliver for free?",
  "Suggest snacks for tea",
]

// Animated green brush-stroke swirl ring (the "bg" from the reference image).
// Two organic arcs on a green gradient, slowly counter-rotating for a
// hand-painted, living feel. Sits behind the avatar via absolute positioning.
function SwirlRing({ className = "" }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full animate-swirl" fill="none">
        <defs>
          <linearGradient id="botSwirlGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a3b1e" />
            <stop offset="45%" stopColor="#2e7d32" />
            <stop offset="100%" stopColor="#8bd18e" />
          </linearGradient>
        </defs>
        {/* thick main brush stroke — an open, tapering ring */}
        <circle
          cx="50" cy="50" r="44"
          stroke="url(#botSwirlGrad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray="228 48" transform="rotate(-28 50 50)"
        />
        {/* lighter thin trailing stroke overlapping for the brushy look */}
        <circle
          cx="50" cy="50" r="44"
          stroke="#7cc47f" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="118 158" transform="rotate(150 50 50)" opacity="0.85"
        />
      </svg>
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: "model", text: GREETING }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Focus input when chat opens & clear the unread pulse
  useEffect(() => {
    if (open) {
      setUnread(false)
      inputRef.current?.focus()
    }
  }, [open])

  // Only the greeting present → show suggestion chips
  const showSuggestions = messages.length === 1 && !loading

  async function sendText(rawText) {
    const text = rawText.trim()
    if (!text || loading) return

    const userMsg = { role: "user", text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      // Send message + conversation history to backend
      const history = updatedMessages.slice(1) // skip the initial greeting
      const res = await sendChatMessageAPI(text, history)
      const reply = res.data?.reply || "Sorry, I couldn't understand that. Can you try again?"

      setMessages(prev => [...prev, { role: "model", text: reply }])
      if (!open) setUnread(true)
    } catch (err) {
      const msg = err.message || ""
      setMessages(prev => [...prev, {
        role: "model",
        text: msg.includes("timed out") || msg.includes("timeout")
          ? "I'm taking too long to think 🤔 — please try a shorter question."
          : msg.includes("offline") || msg.includes("503")
            ? "I'm offline right now. Please try again in a moment."
            : `Sorry, something went wrong: ${msg}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleSend(e) {
    e.preventDefault()
    sendText(input)
  }

  function resetChat() {
    setMessages([{ role: "model", text: GREETING }])
    setInput("")
    inputRef.current?.focus()
  }

  return (
    <>
      {/* ── Chat Panel ── */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] max-w-[390px] h-[560px] max-h-[calc(100vh-7rem)] bg-surface-container-lowest rounded-3xl shadow-[0_16px_56px_rgba(0,0,0,0.18)] border border-outline-variant/15 flex flex-col animate-scale-in overflow-hidden">

          {/* Header */}
          <div className="relative bg-[linear-gradient(135deg,#7f5700_0%,#a97400_100%)] px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <SwirlRing className="-inset-1.5" />
                <span className="material-symbols-outlined text-white text-[22px] relative z-10">storefront</span>
                {/* online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full ring-2 ring-[#a97400] z-20" />
              </div>
              <div>
                <h3 className="text-white font-headline font-bold text-[15px] leading-tight">Vinny</h3>
                <p className="text-white/70 text-[11px] font-label flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  VintunaStore Assistant · Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Start new chat"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[19px]">restart_alt</span>
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 scrollbar-hide bg-surface-container-lowest">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "model" && (
                  <div className="w-7 h-7 rounded-full bg-[linear-gradient(135deg,#7f5700_0%,#a97400_100%)] flex items-center justify-center shrink-0 mb-0.5">
                    <span className="material-symbols-outlined text-white text-[15px]">storefront</span>
                  </div>
                )}
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm font-label leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                  msg.role === "user"
                    ? "bg-[linear-gradient(135deg,#7f5700_0%,#a97400_100%)] text-white rounded-br-md"
                    : "bg-surface-container-high text-on-surface rounded-bl-md"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-[linear-gradient(135deg,#7f5700_0%,#a97400_100%)] flex items-center justify-center shrink-0 mb-0.5">
                  <span className="material-symbols-outlined text-white text-[15px]">storefront</span>
                </div>
                <div className="bg-surface-container-high px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-on-surface/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-on-surface/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-on-surface/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {/* Suggestion chips (only on fresh chat) */}
            {showSuggestions && (
              <div className="pt-1 pl-9 flex flex-wrap gap-2 animate-fade-in">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendText(s)}
                    className="text-[12.5px] font-label text-secondary bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container border border-outline-variant/20 rounded-full px-3 py-1.5 cursor-pointer transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="px-3 py-3 border-t border-outline-variant/10 shrink-0 bg-surface-container-lowest">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message…"
                disabled={loading}
                className="flex-1 bg-surface-container-high/60 border border-outline-variant/15 rounded-full px-4 py-2.5 text-sm font-label focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-on-surface/35 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-[#7f5700] hover:bg-[#a97400] text-white rounded-full flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 shrink-0"
              >
                <span className="material-symbols-outlined text-[19px]">send</span>
              </button>
            </div>
            <p className="text-center text-[10px] text-on-surface/35 font-label mt-2">
              Powered by VintunaStore AI
            </p>
          </form>
        </div>
      )}

      {/* ── Floating Chat Button ── */}
      <button
        onClick={() => setOpen(!open)}
        title={open ? "Close chat" : "Chat with Vinny"}
        className={`fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(127,87,0,0.3)] hover:shadow-[0_6px_28px_rgba(127,87,0,0.45)] active:scale-90 ${
          open
            ? "bg-surface-container-high text-secondary"
            : "bg-[linear-gradient(135deg,#7f5700_0%,#a97400_100%)] text-white"
        }`}
      >
        {/* Animated green swirl ring — the bot's signature look */}
        {!open && <SwirlRing className="-inset-2" />}

        {/* Pulse ring when there's an unread reply */}
        {!open && unread && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#a97400] animate-ping opacity-60" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full ring-2 ring-white" />
          </>
        )}
        <span className="material-symbols-outlined text-[26px] relative z-10">
          {open ? "close" : "chat"}
        </span>
      </button>
    </>
  )
}
