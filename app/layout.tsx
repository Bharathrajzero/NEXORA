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
      <body className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon.svg" alt="Nexora" className="h-6 w-6" />
                <span className="text-sm font-semibold text-slate-900">Nexora</span>
              </div>
              <p className="text-sm text-slate-600">
                © {new Date().getFullYear()} Built by{" "}
                <a
                  href="https://github.com/bharathrajzero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-900 hover:text-sky-600 transition"
                >
                  Alpha Group Ltd
                </a>
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <a href="/dashboard" className="hover:text-slate-900 transition">
                  Dashboard
                </a>
                <a href="/auth" className="hover:text-slate-900 transition">
                  Download
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
