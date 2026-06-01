import type { Metadata } from "next";

// In a normal integration you import the widgets' prebuilt stylesheet once,
// here, at the app entry:
//
//   import "@bloodgpt/widgets/styles.css";
//
// This demo instead generates a complete, brand-accurate stylesheet via the
// app's own Tailwind build (see src/app/globals.css for the why).
import "./globals.css";

export const metadata: Metadata = {
  title: "BloodGPT Widgets — Example",
  description:
    "A Next.js app showcasing the embeddable @bloodgpt/widgets React components.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
