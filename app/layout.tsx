import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XIYU API — Resolve Link SFL/SAFELINKU",
  description:
    "XIYU API for resolving supported SFL / Safelinku links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
