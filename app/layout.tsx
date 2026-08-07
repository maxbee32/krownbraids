import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Krownbraids - Admin Dashboard",
  description: "Krownbraids is a platform that allows users to manage their accounts, including changing passwords and updating personal information. Our goal is to provide a secure and user-friendly experience for all our users.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#172554",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh h-full antialiased">{children}</body>
    </html>
  );
}