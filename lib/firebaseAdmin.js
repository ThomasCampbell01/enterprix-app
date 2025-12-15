import admin from "firebase-admin";
import path from "path";
import fs from "fs";

let app;

try {
  if (!admin.apps.length) {
    const serviceAccountPath = path.join(process.cwd(), "lib", "firebase-service-account.json");

    // Parse JSON manually to avoid import assertion issues
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized");
  }
  app = admin.app();
} catch (err) {
  console.error("❌ Firebase init failed:", err);
}

export const db = admin.firestore();

