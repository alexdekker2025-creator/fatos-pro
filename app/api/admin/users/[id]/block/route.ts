/**
 * Admin User Block API
 * PATCH /api/admin/users/[id]/block - Block or unblock user
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { checkRateLimit } from '@/lib/utils/rateLimit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const blockUserSchema = z.object({
  isBlocked: z.boolean(),
});

/**
 * PATCH /api/admin/users/[id]/block
 * Block or unblock a user
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin session
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Check rate limit
    if (!checkRateLimit(session.userId, 100)) {
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests', retryAfter: 60 },
        { status: 429 }
      );
    }

    // Prevent self-blocking
    if (params.id === session.userId) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'Cannot block your own account' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = blockUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { isBlocked } = validation.data;

    // Update user block status
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { isBlocked },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        emailVerified: true,
        twoFactorEnabled: true,
        isBlocked: true,
        createdAt: true,
        _count: {
          select: {
            calculations: true,
            purchases: true,
          }
        },
        oauthProviders: {
          select: {
            provider: true,
          }
        },
        sessions: {
          where: {
            expiresAt: {
              gte: new Date(),
            }
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            createdAt: true,
          }
        }
      }
    });

    // Create audit log
    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: isBlocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
        details: {
          targetUserId: params.id,
          targetUserEmail: updatedUser.email,
        }
      }
    });

    // If blocking user, delete all active sessions
    if (isBlocked) {
      await prisma.session.deleteMany({
        where: { userId: params.id }
      });
    }

    // Format response
    const response = {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin,
        emailVerified: updatedUser.emailVerified,
        twoFactorEnabled: updatedUser.twoFactorEnabled,
        isBlocked: updatedUser.isBlocked,
        createdAt: updatedUser.createdAt.toISOString(),
        lastLogin: updatedUser.sessions[0]?.createdAt.toISOString() || null,
        calculationsCount: updatedUser._count.calculations,
        purchasesCount: updatedUser._count.purchases,
        oauthProviders: updatedUser.oauthProviders.map(p => p.provider),
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'DATABASE_ERROR', message: 'Failed to update user block status' },
      { status: 500 }
    );
  }
}
