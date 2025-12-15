// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Enterprix AI",
  description: "Your AI business assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">{children}</body>
    </html>
  );
}
