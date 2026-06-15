import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Anonymous Burnout Tracker",
  description: "Anonimna anketa o delovni obremenitvi in izgorelosti.",
};

const themeBootScript = `(function(){try{var k="burnout-theme",t=localStorage.getItem(k),dark;if(t==="light")dark=false;else if(t==="dark")dark=true;else if(t==="system")dark=window.matchMedia("(prefers-color-scheme: dark)").matches;else dark=window.matchMedia("(prefers-color-scheme: dark)").matches;if(dark)document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");document.documentElement.style.colorScheme=dark?"dark":"light";}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
