import { NextResponse } from 'next/server';
import { getLastOAuthError } from '@/lib/debug/oauth-error-store';

// Temporary debug endpoint to view last OAuth error
// This will be removed after debugging

export async function GET() {
  return NextResponse.json({
    lastError: getLastOAuthError(),
    note: 'This is a temporary debug endpoint. It will be removed after OAuth is fixed.',
  });
}

export const dynamic = 'force-dynamic';
