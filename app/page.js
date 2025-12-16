"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "./config";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [credits, setCredits] = useState("Loading...");
  const [tier, setTier] = useState("Free");
  const [userId, setUserId] = useState("guest");
  const [connecting, setConnecting] = useState(false);

  // Load initial system message
  useEffect(() => {
    setMessages([{ role: "system", content: "Enterprix Chatbot ready!" }]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setConnecting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          userId,
          tier,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data.reply || data.message || "Error: No response from chatbot.";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Error connecting to server:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error connecting to server." },
      ]);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", height: "100vh" }}>
      <h2 style={{ padding: "10px" }}>Enterprix Chatbot</h2>

      <div style={{ padding: "0 10px" }}>
        <label>
          Tier:{" "}
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            style={{ marginRight: "10px" }}
          >
            <option>Free</option>
            <option>Pro</option>
            <option>Enterprise</option>
          </select>
        </label>
        <label>
          User ID:{" "}
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: "150px" }}
          />
        </label>
      </div>

      <div
        style={{
          height: "70%",
          overflowY: "auto",
          backgroundColor: "#111",
          margin: "10px",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              color: msg.role === "assistant" ? "lime" : "white",
              margin: "4px 0",
            }}
          >
            <strong>{msg.role === "assistant" ? "Bot" : "You"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <div style={{ padding: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "70%", marginRight: "10px" }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={connecting}>
          {connecting ? "Sending..." : "Send"}
        </button>
      </div>

      <div style={{ color: "gold", paddingLeft: "10px" }}>
        💰 Remaining Credits: {credits}
      </div>
    </div>
  );
}
