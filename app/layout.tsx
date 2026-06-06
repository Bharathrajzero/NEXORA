import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora | File Relay",
  description: "Drop files on one device, scan QR code to download on another. No email, no login.",
  manifest: "/manifest.webmanifest",
  applicationName: "Nexora",
  appleWebApp: {
    capable: true,
    title: "Nexora",
    statusBarStyle: "default"
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
