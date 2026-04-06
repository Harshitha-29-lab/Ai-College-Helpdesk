import { useState, useEffect, useRef } from 'react'

// Quick-reply chip options
const QUICK_REPLIES = [
  '📅 Exam Dates',
  '📚 My Subjects',
  '🕘 College Timing',
  '💳 Fee Info',
  '📖 Library Hours',
  '📊 My Results',
]

function Chat() {
  // ---------- State ----------
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Ref to auto-scroll to the latest message
  const messagesEndRef = useRef(null)

  // ---------- On mount: show welcome message ----------
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        text: "👋 Hi! I'm your College Helpdesk Assistant. Ask me about exams, subjects, timings, fees, library, or results!",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'system',
      },
    ])
  }, [])

  // ---------- Auto-scroll when messages change ----------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // ---------- Send message ----------
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || isLoading) return

    // Add user message immediately
    const userMsg = {
      id: Date.now(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })
      const data = await res.json()

      const botMsg = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      const errorMsg = {
        id: Date.now() + 1,
        text: "❌ Sorry, I couldn't connect to the server. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'error',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // ---------- Handle Enter key ----------
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  // ---------- Render ----------
  return (
    <div className="w-full max-w-2xl h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* ===== Header ===== */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 flex items-center gap-3">
        <div className="text-2xl">💬</div>
        <div className="flex-1">
          <h1 className="text-base font-bold leading-tight">Chat with Helpdesk</h1>
        </div>
        <span className="flex items-center gap-1.5 text-xs bg-indigo-500/40 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Online
        </span>
      </div>

      {/* ===== Messages Area ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%]`}>
              <div
                className={
                  msg.sender === 'user'
                    ? 'chat-bubble-user bg-indigo-600 text-white px-4 py-3 shadow-md'
                    : 'chat-bubble-bot bg-white text-gray-800 px-4 py-3 shadow-md border border-gray-200'
                }
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
              <div
                className={`flex items-center gap-2 mt-1 text-xs text-gray-400 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'bot' && msg.source && msg.source !== 'system' && msg.source !== 'error' && (
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px] font-medium">
                    {msg.source === 'ai' ? '🤖 AI Assistant' : '📋 FAQ Database'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-bubble-bot bg-white px-5 py-3 shadow-md border border-gray-200 flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ===== Quick Reply Chips ===== */}
      <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
        {QUICK_REPLIES.map((chip) => (
          <button
            key={chip}
            onClick={() => sendMessage(chip)}
            disabled={isLoading}
            className="flex-shrink-0 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* ===== Input Bar ===== */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          disabled={isLoading}
          className="flex-1 rounded-full border border-gray-300 px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:bg-gray-50"
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Chat
