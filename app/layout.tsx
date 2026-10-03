import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeBypass Test",
  description: "SafeBypass API client",
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
