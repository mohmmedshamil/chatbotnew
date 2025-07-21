"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!url.trim()) return;
    setLoading(true);
    await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#1F1F1F] flex items-center justify-center px-4">
      <div className="bg-[#2C2C2C] p-8 md:p-10 rounded-2xl shadow-xl max-w-xl w-full text-gray-200">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🤖 Website Chatbot Generator
        </h1>

        <label className="text-sm text-gray-400 mb-2 block">Website URL</label>
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#1F1F1F] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <motion.button
          onClick={handleScrape}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Processing..." : "Generate Bot"}
        </motion.button>
      </div>
    </main>
  );
}
