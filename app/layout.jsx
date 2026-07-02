// removed TypeScript-only type import for JSX file
// جديد (مدمج)
import { Geist, Geist_Mono } from "next/font/google";
import { Tajawal } from "next/font/google"; // أضف هذا السطر
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// أضف تعريف خط Tajawal
const tajawal = Tajawal({
  weight: ["400", "700", "900"], // يمكنك اختيار الأوزان التي تريدها
  subsets: ["arabic"],
  variable: "--font-tajawal", // متغير CSS للخط
  display: "swap", // تحسين أداء التحميل
});

export const metadata = {
  title: "بوابة سداد الامارات",
  description: "بوابة سداد الامارات - منصة شاملة لتسهيل المدفوعات والخدمات المالية في الإمارات العربية المتحدة.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar" // غيّر إلى العربية
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} h-full antialiased`}
      dir="rtl"
    >
      <body className="min-h-full flex flex-col font-tajawal">{children}</body>
    </html>
  );
}