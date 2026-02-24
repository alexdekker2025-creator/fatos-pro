'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function OAuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    const locale = searchParams.get('locale') || 'ru';
    
    if (sessionId) {
      // Store session in localStorage (matching the app's auth pattern)
      localStorage.setItem('sessionId', sessionId);
      
      // Redirect to profile
      router.push(`/${locale}/profile`);
    } else {
      // No session ID, redirect to home
      router.push(`/${locale}`);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl">Завершение входа...</p>
      </div>
    </div>
  );
}

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    }>
      <OAuthSuccessContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
