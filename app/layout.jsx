'use client' // <-- ضروري لاستخدام useEffect

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 1. استيراد الخطوط من next/font/google
import { Geist, Geist_Mono, Tajawal } from "next/font/google";
import "./globals.css";

// 2. تهيئة خط Geist Sans
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 3. تهيئة خط Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 4. تهيئة خط Tajawal (للغة العربية)
const tajawal = Tajawal({
  weight: ["400", "700", "900"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
});

// 5. بيانات الـ Meta Data الخاصة بالصفحة (لن تعمل مع 'use client'، سننقلها)
// export const metadata = { ... };

// 6. مكون داخلي لإدارة منع الرجوع
function PreventBackHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // ====== منع زر الرجوع في المتصفح ======
    
    // 1. إضافة حالة جديدة في التاريخ لمنع الرجوع
    window.history.pushState(null, '', window.location.href);

    // 2. التعامل مع حدث popstate (عند الضغط على زر الرجوع)
    const handlePopState = (event: PopStateEvent) => {
      // منع الرجوع وإعادة توجيه المستخدم إلى نفس الصفحة
      window.history.pushState(null, '', window.location.href);
      
      // اختياري: عرض رسالة للمستخدم
      // alert('لا يمكن الرجوع إلى الخلف');
    };

    // 3. منع الرجوع باستخدام لوحة المفاتيح (Backspace)
    const handleKeyDown = (e: KeyboardEvent) => {
      // منع Backspace و Alt+Left
      if (e.key === 'Backspace' || (e.altKey && e.key === 'ArrowLeft')) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };

    // 4. إضافة المستمعات
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    // ====== إخفاء مسار التنقل (Breadcrumb) ======
    const hideBreadcrumb = () => {
      // تغيير عنوان الصفحة
      document.title = 'بوابة سداد الامارات';
      
      // إخفاء أي عناصر Breadcrumb
      const breadcrumbSelectors = [
        '.breadcrumb',
        '.breadcrumbs',
        'nav[aria-label="Breadcrumb"]',
        '[role="navigation"][aria-label*="breadcrumb"]',
        '.MuiBreadcrumbs-root', // لـ Material-UI
        '.chakra-breadcrumb', // لـ Chakra UI
      ];
      
      breadcrumbSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
      });
    };

    // تنفيذ الإخفاء فوراً
    hideBreadcrumb();

    // مراقبة التغييرات في DOM لإخفاء أي Breadcrumb جديد
    const observer = new MutationObserver(() => {
      hideBreadcrumb();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // ====== إخفاء مسار التنقل في شريط العنوان ======
    // تغيير مسار المتصفح ليظهر بشكل جميل
    const updateUrl = () => {
      if (window.location.pathname !== '/') {
        // إخفاء المسار في شريط العنوان (اختياري)
        // يمكنك استخدام History API لتغيير المسار
        // window.history.replaceState(null, '', '/');
      }
    };

    updateUrl();

    // ====== التنظيف عند إزالة المكون ======
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}

// 7. المكون الرئيسي (RootLayout)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} antialiased h-full`}
    >
      <head>
        {/* Meta tags للتحكم في العرض */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#800000" />
        
        {/* منع التخزين المؤقت */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Open Graph Image */}
        <meta property="og:image" content="https://raw.githubusercontent.com/alimilad9988/sdad-emarat/refs/heads/main/public/link.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content="بوابة سداد الامارات" />
        <meta property="og:description" content="بوابة سداد الامارات - منصة شاملة لتسهيل المدفوعات والخدمات المالية في الإمارات العربية المتحدة." />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="بوابة سداد الامارات" />
        <meta name="twitter:description" content="بوابة سداد الامارات - منصة شاملة لتسهيل المدفوعات والخدمات المالية في الإمارات العربية المتحدة." />
        <meta name="twitter:image" content="https://raw.githubusercontent.com/alimilad9988/sdad-emarat/refs/heads/main/public/link.jpg" />
      </head>
      <body className="min-h-full flex flex-col font-tajawal bg-gradient-to-br from-gray-50 to-gray-100">
        <PreventBackHandler>
          {children}
        </PreventBackHandler>
      </body>
    </html>
  );
}
