import type { Metadata } from "next";
import { Hind_Siliguri, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { NotificationProvider } from "@/components/providers/NotificationProvider";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reunion 2022",
  description: "Reconnecting old friends, creating new memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body
        className={`${hindSiliguri.variable} ${outfit.variable} antialiased bg-white text-gray-900 min-h-screen font-outfit`}
      >
        <AuthProvider>
          <NotificationProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
