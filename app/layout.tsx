import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Clean Switch",
  description: "Vetted non-toxic swaps for every room in your home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans`} style={{ background: '#f8f7f4', color: '#1c1917' }}>
        <header style={{ background: '#fff', borderBottom: '1px solid #e8e5df', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, minWidth: 0 }}>
              <div style={{ width: 26, height: 26, background: '#3d4a35', borderRadius: 6, flexShrink: 0 }} />
              <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 17, color: '#1c1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                The Clean Switch
              </span>
            </a>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
              <a href="/" className="hidden sm:block" style={{ fontSize: 14, fontWeight: 500, color: '#7a7060', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Shop Swaps
              </a>
              <a href="/scan" style={{ fontSize: 14, fontWeight: 600, background: '#3d4a35', color: '#fff', padding: '9px 18px', borderRadius: 99, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Scan Product
              </a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-24 py-12 border-t" style={{ borderColor: '#e8e5df' }}>
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-serif font-bold text-lg" style={{ color: '#3d4a35' }}>The Clean Switch</span>
            <p className="text-sm" style={{ color: '#a09880' }}>
              © {new Date().getFullYear()} · Made with care for cleaner living
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
