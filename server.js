import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";

// Load Firebase credentials
const serviceAccount = JSON.parse(
  fs.readFileSync("./firebase-service-account.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// Default route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("✅ Enterprix API is running successfully.");
});

// Chat route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, userId = "guest", tier = "free" } = req.body;
    const usersRef = db.collection("users");
    const userDoc = usersRef.doc(userId);
    const userSnap = await userDoc.get();

    let credits = 10;
    if (userSnap.exists) {
      credits = userSnap.data().credits ?? 10;
    } else {
      await userDoc.set({ tier, credits: 10 });
    }

    // Deduct 1 credit per message
    if (credits <= 0) {
      return res.json({ reply: "Out of credits! Please upgrade your plan.", remainingCredits: 0 });
    }

    const newCredits = credits - 1;
    await userDoc.update({ credits: newCredits });

    // Dummy reply (you’ll replace with OpenAI call later)
    const reply = `Echo: ${message}`;
    res.json({ reply, remainingCredits: newCredits });
  } catch (error) {
    console.error("Error handling chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start backend on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
