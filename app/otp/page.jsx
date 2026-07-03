import { Suspense } from 'react';
import OTPContent from './OTPContent';

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008000] mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري التحميل...</p>
                </div>
            </div>
        }>
            <OTPContent />
        </Suspense>
    );
}
