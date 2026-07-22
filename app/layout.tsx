import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PW Listing Atom",
  description: "The daily operating system for your real estate business."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
