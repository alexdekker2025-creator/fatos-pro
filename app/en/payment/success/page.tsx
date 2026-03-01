'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { usePurchases } from '@/lib/hooks/usePurchases';

/**
 * Payment success page content
 */
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = usePurchases();
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    serviceId: string;
    amount: string;
  } | null>(null);

  useEffect(() => {
    // Get parameters from URL
    const orderId = searchParams.get('orderId');
    const serviceId = searchParams.get('serviceId');
    const amount = searchParams.get('amount');

    if (orderId && serviceId && amount) {
      setOrderInfo({ orderId, serviceId, amount });
    }

    // Refresh purchases to update UI immediately
    refresh();

    setLoading(false);
  }, [searchParams, refresh]);

  const getServiceName = (serviceId: string) => {
    switch (serviceId) {
      case 'full_pythagorean':
        return 'Full Pythagorean Square';
      case 'destiny_matrix':
        return 'Destiny Matrix';
      default:
        return 'Premium Service';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="text-purple-200 mb-6">
          Thank you for your purchase! Your payment has been successfully processed.
        </p>

        {/* Order information */}
        {orderInfo && (
          <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
            <div className="text-purple-200 text-sm mb-2">
              <span className="font-semibold">Service:</span>{' '}
              {getServiceName(orderInfo.serviceId)}
            </div>
            <div className="text-purple-200 text-sm mb-2">
              <span className="font-semibold">Amount:</span> {orderInfo.amount}
            </div>
            <div className="text-purple-200 text-sm">
              <span className="font-semibold">Order ID:</span>{' '}
              {orderInfo.orderId}
            </div>
          </div>
        )}

        {/* Unlock information */}
        <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4 mb-6">
          <p className="text-purple-100 text-sm">
            ✨ Premium content unlocked! You can now use all features of the
            purchased service.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link href="/en" className="block">
            <Button variant="primary" className="w-full">
              Back to Home
            </Button>
          </Link>
          <Link href="/en/profile" className="block">
            <Button variant="secondary" className="w-full">
              Go to Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Payment success page
 */
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

// Disable static generation for this page
export const dynamic = 'force-dynamic';
