import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Old Games Arena",
  description: "Old Games Arena - Your personal classic games dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
