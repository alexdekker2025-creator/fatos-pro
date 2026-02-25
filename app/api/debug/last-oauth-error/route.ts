import { NextResponse } from 'next/server';

// Temporary debug endpoint to view last OAuth error
// This will be removed after debugging

let lastError: any = null;

export function setLastOAuthError(error: any) {
  lastError = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    type: error instanceof Error ? error.constructor.name : typeof error,
    timestamp: new Date().toISOString(),
  };
}

export async function GET() {
  return NextResponse.json({
    lastError,
    note: 'This is a temporary debug endpoint. It will be removed after OAuth is fixed.',
  });
}

export const dynamic = 'force-dynamic';
