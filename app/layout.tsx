import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Clean Switch",
  description: "Vetted non-toxic swaps for every room in your home.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "The Clean Switch",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-full bg-stone-50`}>
        <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-semibold text-xl text-stone-800">The Clean Switch</span>
            </a>
            <a href="/scan" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
              <span>📷</span> Scan Product
            </a>
          </div>
        </header>
        {children}
        <footer className="mt-20 py-10 text-center text-sm text-stone-400 border-t border-stone-100">
          <p>© {new Date().getFullYear()} The Clean Switch · Made with care for cleaner living</p>
        </footer>
      </body>
    </html>
  );
}
