'use client'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// استيراد الخطوط
import { Geist, Geist_Mono, Tajawal } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tajawal = Tajawal({
  weight: ["400", "700", "900"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
});

// مكون لإدارة منع الرجوع فقط
function AppHandler({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    // ====== 1. منع الرجوع في المتصفح ======
    
    // إضافة حالة جديدة في التاريخ
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (event) => {
      // منع الرجوع
      window.history.pushState(null, '', window.location.href);
      
      // اختياري: عرض رسالة
      // alert('لا يمكن الرجوع إلى الخلف');
    };

    // منع Backspace و Alt+Left
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' || (e.altKey && e.key === 'ArrowLeft')) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    // ====== تم إزالة كود إخفاء المسار (hidePath) ======

    // ====== 2. إخفاء Breadcrumb فقط ======
    const hideBreadcrumb = () => {
      document.title = 'بوابة سداد الامارات';
      
      const breadcrumbSelectors = [
        '.breadcrumb',
        '.breadcrumbs',
        'nav[aria-label="Breadcrumb"]',
        '[role="navigation"][aria-label*="breadcrumb"]',
        '.MuiBreadcrumbs-root',
        '.chakra-breadcrumb',
      ];
      
      breadcrumbSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.style.display = 'none';
        });
      });
    };

    hideBreadcrumb();

    // مراقبة التغييرات (لإخفاء Breadcrumb فقط)
    const observer = new MutationObserver(() => {
      hideBreadcrumb();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // ====== تم إزالة مراقبة تغييرات المسار ======

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} antialiased h-full`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#800000" />
        
        {/* منع التخزين المؤقت */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Open Graph */}
        <meta property="og:image" content="https://raw.githubusercontent.com/alimilad9988/sdad-emarat/refs/heads/main/public/link.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content="بوابة سداد الامارات" />
        <meta property="og:description" content="بوابة سداد الامارات - منصة شاملة لتسهيل المدفوعات والخدمات المالية في الإمارات العربية المتحدة." />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="بوابة سداد الامارات" />
        <meta name="twitter:description" content="بوابة سداد الامارات - منصة شاملة لتسهيل المدفوعات والخدمات المالية في الإمارات العربية المتحدة." />
        <meta name="twitter:image" content="https://raw.githubusercontent.com/alimilad9988/sdad-emarat/refs/heads/main/public/link.jpg" />
      </head>
      <body className="min-h-full flex flex-col font-tajawal bg-gradient-to-br from-gray-50 to-gray-100">
        <AppHandler>
          {children}
        </AppHandler>
      </body>
    </html>
  );
}
