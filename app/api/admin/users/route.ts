/**
 * Admin Users API
 * GET /api/admin/users - List users with pagination and filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { checkRateLimit } from '@/lib/utils/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '25');
    const search = searchParams.get('search') || '';
    const emailVerified = searchParams.get('emailVerified');
    const twoFactorEnabled = searchParams.get('twoFactorEnabled');
    const isBlocked = searchParams.get('isBlocked');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Boolean filters
    if (emailVerified !== null && emailVerified !== undefined && emailVerified !== '') {
      where.emailVerified = emailVerified === 'true';
    }
    if (twoFactorEnabled !== null && twoFactorEnabled !== undefined && twoFactorEnabled !== '') {
      where.twoFactorEnabled = twoFactorEnabled === 'true';
    }
    if (isBlocked !== null && isBlocked !== undefined && isBlocked !== '') {
      where.isBlocked = isBlocked === 'true';
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === 'email' || sortBy === 'createdAt') {
      orderBy[sortBy] = sortOrder;
    }

    // Fetch users with counts
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
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
      }),
      prisma.user.count({ where })
    ]);

    // Format response
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.sessions[0]?.createdAt.toISOString() || null,
      calculationsCount: user._count.calculations,
      purchasesCount: user._count.purchases,
      oauthProviders: user.oauthProviders.map(p => p.provider),
    }));

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      users: formattedUsers,
      total,
      page,
      pageSize,
      totalPages,
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'DATABASE_ERROR', message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
