import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, LoaderCircle } from "lucide-react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";

const GREETING = {
  role: "assistant",
  text: "Hi! I'm your finance assistant. Ask me things like \"How much did I spend?\" or \"What was my biggest income?\"",
};

const AiChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("smart"); // "smart" (full context + memory) or "rag" (retrieval)
  const endRef = useRef(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const endpoint = mode === "rag" ? API_ENDPOINTS.AI_CHAT_RAG : API_ENDPOINTS.AI_CHAT;
      const { data } = await axiosConfig.post(endpoint, { message: question });
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (error) {
      console.log("Error chatting with AI:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't answer that right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="flex flex-col w-[360px] h-[480px] max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-purple-600 text-white">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="h-5 w-5" />
              Finance Assistant
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-purple-700 rounded p-1 transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode toggle: Smart (full context + memory) vs RAG (retrieval) */}
          <div className="flex items-center gap-1 px-3 py-2 bg-purple-50 border-b border-purple-100 text-xs">
            <span className="text-slate-500 mr-1">Mode:</span>
            {["smart", "rag"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2 py-0.5 rounded-full capitalize transition ${
                  mode === m
                    ? "bg-purple-600 text-white"
                    : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-100"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 border border-gray-200 px-3 py-2 rounded-lg rounded-bl-none text-sm flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances..."
              className="flex-1 border border-gray-300 rounded-md py-2 px-3 text-sm outline-none focus:border-purple-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-md transition"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-full shadow-lg transition"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium">Ask AI</span>
        </button>
      )}
    </div>
  );
};

export default AiChatWidget;
