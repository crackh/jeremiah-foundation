import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jeremiah 29:11 Kids Foundation Uganda",
  description: "Building Hope, Transforming Communities",
  icons: {
    icon: [
      { url: "/jkf.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Fallback in case metadata icons don’t render */}
        <link rel="icon" href="/jkf.png" type="image/png" />
      </head>
      <body className="bg-gray-50 text-gray-800">
        <Navbar />
        <main className="min-h-screen max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
