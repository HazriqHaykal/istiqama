import type { Metadata } from "next";
import { Amiri, Work_Sans } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  variable: "--font-worksans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "istiqama — Stay consistent. Stay connected.",
  description: "A daily dashboard for prayer times, Tahajud, Qur'an reading, and hadith of the day.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${amiri.variable} ${workSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-ink font-sans">{children}</body>
    </html>
  );
}
