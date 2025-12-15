"use client";

import { useState } from "react";

// Automatically picks correct backend URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [tier, setTier] = useState("free");
  const [userId, setUserId] = useState("guest");
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          userId,
          tier,
        }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { sender: "bot", text: data.reply || "Error: No response" },
      ]);

      if (typeof data.remainingCredits !== "undefined") {
        setCredits(data.remainingCredits);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Error connecting to server." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: "1rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Enterprix Chatbot</h2>

      <label>
        Tier:{" "}
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
        </select>
      </label>
      <br />

      <label>
        User ID:{" "}
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </label>

      <div
        style={{
          background: "#111",
          border: "1px solid #333",
          padding: "10px",
          height: "60vh",
          marginTop: "10px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, idx) => (
          <p key={idx} style={{ color: msg.sender === "user" ? "#ccc" : "#0f0" }}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "80%", padding: "5px" }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ marginLeft: "5px" }}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <p style={{ color: "#ff0", marginTop: "10px" }}>
        💰 Remaining Credits: {credits !== null ? credits : "Loading..."}
      </p>
    </div>
  );
}
