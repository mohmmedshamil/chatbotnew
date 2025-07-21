"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ question: input }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Sorry, something went wrong." },
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center text-green-400">
          💬 Chat With Website
        </h1>

        {/* Chat Window */}
        <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-700 rounded-lg">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${
                  msg.role === "user"
                    ? "bg-green-500 text-white"
                    : "bg-gray-600 text-gray-100"
                }`}
              >
                <span className="block font-medium mb-1">
                  {msg.role === "user" ? "You" : "Bot"}
                </span>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex mt-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-l-lg bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-r-lg transition disabled:opacity-50"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
