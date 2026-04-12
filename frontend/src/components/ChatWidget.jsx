import { useState, useRef, useEffect } from "react"
import { sendChatMessageAPI } from "../api"

// ──────────────────────────────────────────────
// HOW THIS COMPONENT WORKS:
//
// 1. Floating green chat button (bottom-right corner)
// 2. Click → opens chat panel
// 3. User types message → sends to POST /api/v1/chat
// 4. Backend searches MongoDB products → sends to Gemini AI
// 5. AI response displayed in chat bubble
// 6. Full conversation history is sent each time so AI
//    remembers what was discussed earlier
// ──────────────────────────────────────────────

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "model", text: "Namaste! I'm VintunaStore assistant. Ask me about our products, prices, or anything about our store!" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    // Add user message to chat
    const userMsg = { role: "user", text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      // Send message + conversation history to backend
      // Backend will search products and ask Gemini AI
      const history = updatedMessages.slice(1) // skip the initial greeting
      const res = await sendChatMessageAPI(text, history)
      const reply = res.data?.reply || "Sorry, I couldn't understand that. Can you try again?"

      setMessages(prev => [...prev, { role: "model", text: reply }])
    } catch (err) {
      const msg = err.message || ""
      setMessages(prev => [...prev, {
        role: "model",
        text: msg.includes("timed out") || msg.includes("timeout")
          ? "AI is taking too long. Please try a shorter question."
          : msg.includes("offline") || msg.includes("503")
            ? "AI service is not running. Make sure Ollama is started."
            : `Sorry, something went wrong: ${msg}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── Chat Panel ── */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 w-[340px] sm:w-[380px] max-h-[520px] bg-surface-container-lowest rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.15)] border border-outline-variant/15 flex flex-col animate-scale-in overflow-hidden">

          {/* Header */}
          <div className="bg-[linear-gradient(135deg,#7f5700_0%,#a97400_100%)] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">smart_toy</span>
              </div>
              <div>
                <h3 className="text-white font-headline font-bold text-sm">VintunaStore AI</h3>
                <p className="text-white/60 text-[10px] font-label">Ask about products, prices & more</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm font-label leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary-container text-on-primary-container rounded-br-sm"
                    : "bg-surface-container-high text-on-surface rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-container-high px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-on-surface/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-on-surface/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-on-surface/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="px-3 py-3 border-t border-outline-variant/10 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about products..."
                disabled={loading}
                className="flex-1 bg-surface-container-high/50 border border-outline-variant/15 rounded-full px-4 py-2.5 text-sm font-label focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-on-surface/35 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-9 h-9 bg-[#7f5700] hover:bg-[#a97400] text-white rounded-full flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Floating Chat Button ── */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(127,87,0,0.3)] hover:shadow-[0_6px_28px_rgba(127,87,0,0.4)] active:scale-90 ${
          open
            ? "bg-surface-container-high text-secondary rotate-0"
            : "bg-[#7f5700] text-white"
        }`}
      >
        <span className="material-symbols-outlined text-[26px]">
          {open ? "close" : "smart_toy"}
        </span>
      </button>
    </>
  )
}
