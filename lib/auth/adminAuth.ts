/**
 * Admin Authentication Utilities
 * 
 * Provides functions for verifying admin access and session validation
 */

import { prisma } from '@/lib/prisma';

export interface AdminSession {
  id: string;
  userId: string;
  expiresAt: Date;
  user: {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  };
}

/**
 * Verify admin session from request
 * 
 * Checks:
 * 1. Session exists
 * 2. Session has not expired
 * 3. User associated with session has isAdmin=true
 * 
 * @param request - Next.js request object
 * @returns AdminSession if valid, null otherwise
 */
export async function verifyAdminSession(request: Request): Promise<AdminSession | null> {
  try {
    // Extract sessionId from query parameters
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      return null;
    }
    
    // Fetch session with user data
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            isBlocked: true,
          }
        }
      }
    });
    
    if (!session) {
      return null;
    }
    
    // Check if session has expired
    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({ where: { id: sessionId } });
      return null;
    }
    
    // Check if user is blocked
    if (session.user.isBlocked) {
      return null;
    }
    
    // Check if user is admin
    if (!session.user.isAdmin) {
      return null;
    }
    
    // Return valid admin session
    return {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        isAdmin: session.user.isAdmin,
      }
    };
  } catch (error) {
    console.error('Admin session verification error:', error);
    return null;
  }
}

/**
 * Verify admin session from sessionId string
 * 
 * @param sessionId - Session ID string
 * @returns AdminSession if valid, null otherwise
 */
export async function verifyAdminSessionById(sessionId: string): Promise<AdminSession | null> {
  try {
    if (!sessionId) {
      return null;
    }
    
    // Fetch session with user data
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            isBlocked: true,
          }
        }
      }
    });
    
    if (!session) {
      return null;
    }
    
    // Check if session has expired
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: sessionId } });
      return null;
    }
    
    // Check if user is blocked
    if (session.user.isBlocked) {
      return null;
    }
    
    // Check if user is admin
    if (!session.user.isAdmin) {
      return null;
    }
    
    return {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        isAdmin: session.user.isAdmin,
      }
    };
  } catch (error) {
    console.error('Admin session verification error:', error);
    return null;
  }
}
