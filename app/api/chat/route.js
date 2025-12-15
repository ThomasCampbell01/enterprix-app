import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, tier = "free", userId = "guest" } = await req.json();

    if (!message) {
      return NextResponse.json({ ok: false, error: "Missing message" });
    }

    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    let userData;

    if (!doc.exists) {
      userData = { tier, credits: 10 };
      await userRef.set(userData);
      console.log("🆕 Created new user:", userData);
    } else {
      userData = doc.data();
    }

    if (userData.credits <= 0) {
      return NextResponse.json({
        ok: false,
        error: "No credits remaining",
        remainingCredits: 0,
      });
    }

    // For now just echo the message — we’ll switch to OpenAI after credit tracking is confirmed
    const reply = `Echo: ${message}`;
    const updatedCredits = userData.credits - 1;

    await userRef.update({ credits: updatedCredits });
    console.log(`💰 Updated credits for ${userId}: ${updatedCredits}`);

    return NextResponse.json({
      ok: true,
      reply,
      remainingCredits: updatedCredits,
    });
  } catch (err) {
    console.error("🔥 Chat route error:", err);
    return NextResponse.json({ ok: false, error: err.message });
  }
}
