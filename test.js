// test.js
import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

async function testPing() {
  console.log("Testing /api/ping ...");
  try {
    const res = await fetch(`${BASE_URL}/api/ping`);
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", data);
  } catch (err) {
    console.error("Ping test failed:", err.message);
  }
}

async function testChatNoAuth() {
  console.log("\nTesting /api/chat without auth (should be 401) ...");
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Hello from test.js" }
        ],
      }),
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (err) {
    console.error("Chat test failed:", err.message);
  }
}

async function runTests() {
  await testPing();
  await testChatNoAuth();
}

runTests();
