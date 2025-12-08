"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";


interface ChatItem {
  role: "user" | "assistant";
  content: string;
}

export default function TutorChat({ userId }: { userId: number }) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMsg: ChatItem = { role: "user", content: message };

    setHistory((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          message,
          history,
        }),
      });

      const data = await response.json();
      const replyMsg: ChatItem = {
        role: "assistant",
        content: data.reply,
      };

      setHistory((prev) => [...prev, replyMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-3">AI Tutor Chat</h2>

      <div className="h-80 overflow-y-auto border p-3 rounded-md bg-gray-50">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 rounded-lg ${
              msg.role === "assistant"
                ? "bg-indigo-100 text-indigo-900"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <strong>{msg.role === "assistant" ? "Tutor: " : "You: "}</strong>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 border p-2 rounded-md"
          placeholder="Ask your tutor..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
