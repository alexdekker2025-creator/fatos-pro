/**
 * Admin User Details API
 * GET /api/admin/users/[id] - Get user details
 * PUT /api/admin/users/[id] - Update user
 * DELETE /api/admin/users/[id] - Delete user
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession, verifyAdminSessionById } from '@/lib/auth/adminAuth';
import { checkRateLimit } from '@/lib/utils/rateLimit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schemas
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  isAdmin: z.boolean().optional(),
});

const deleteUserSchema = z.object({
  confirmation: z.string().min(1),
});

/**
 * GET /api/admin/users/[id]
 * Get detailed user information
 */
export async function GET(
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

    // Fetch user with detailed information
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        emailVerified: true,
        twoFactorEnabled: true,
        isBlocked: true,
        preferredLang: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            calculations: true,
            purchases: true,
          }
        },
        calculations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            createdAt: true,
            birthDay: true,
            birthMonth: true,
            birthYear: true,
          }
        },
        purchases: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            serviceId: true,
            createdAt: true,
            order: {
              select: {
                amount: true,
                currency: true,
                status: true,
              }
            }
          }
        },
        oauthProviders: {
          select: {
            provider: true,
            createdAt: true,
          }
        },
        securityLogs: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            event: true,
            ipAddress: true,
            createdAt: true,
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

    if (!user) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found' },
        { status: 404 }
      );
    }

    // Format response
    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        isBlocked: user.isBlocked,
        preferredLang: user.preferredLang,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      activity: {
        calculationsCount: user._count.calculations,
        purchasesCount: user._count.purchases,
        lastLogin: user.sessions[0]?.createdAt.toISOString() || null,
        recentCalculations: user.calculations.map(c => ({
          id: c.id,
          date: c.createdAt.toISOString(),
          birthDate: `${c.birthDay}.${c.birthMonth}.${c.birthYear}`,
        })),
        recentPurchases: user.purchases.map(p => ({
          id: p.id,
          serviceId: p.serviceId,
          date: p.createdAt.toISOString(),
          amount: p.order.amount.toString(),
          currency: p.order.currency,
          status: p.order.status,
        })),
      },
      security: {
        oauthProviders: user.oauthProviders.map(p => ({
          provider: p.provider,
          linkedAt: p.createdAt.toISOString(),
        })),
        securityEvents: user.securityLogs.map(log => ({
          id: log.id,
          event: log.event,
          ipAddress: log.ipAddress,
          timestamp: log.createdAt.toISOString(),
        })),
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'DATABASE_ERROR', message: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update user information
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parse body first to get sessionId
    const body = await request.json();
    console.log('PUT /api/admin/users/[id] - Body:', JSON.stringify(body, null, 2));
    console.log('PUT /api/admin/users/[id] - Params:', params);
    
    // Extract sessionId from body
    const sessionId = body.sessionId;
    if (!sessionId) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'No session ID provided' },
        { status: 401 }
      );
    }
    
    // Verify admin session using sessionId directly
    const session = await verifyAdminSessionById(sessionId);
    console.log('PUT /api/admin/users/[id] - Session:', session ? 'Valid' : 'Invalid');
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

    // Parse and validate request body (excluding sessionId)
    const { sessionId, ...updateData } = body;
    const validation = updateUserSchema.safeParse(updateData);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const updates = validation.data;

    // Prevent self-demotion from admin
    if (params.id === session.userId && updates.isAdmin === false) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'Cannot remove your own admin privileges' },
        { status: 403 }
      );
    }

    // Check email uniqueness if email is being updated
    if (updates.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: updates.email },
        select: { id: true }
      });

      if (existingUser && existingUser.id !== params.id) {
        return NextResponse.json(
          { error: 'VALIDATION_ERROR', message: 'Email already exists', field: 'email' },
          { status: 400 }
        );
      }
    }

    // Get old user data for audit log
    const oldUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { email: true, name: true, isAdmin: true }
    });

    if (!oldUser) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updates,
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
    const changes: any = {};
    if (updates.email && updates.email !== oldUser.email) {
      changes.email = { old: oldUser.email, new: updates.email };
    }
    if (updates.name && updates.name !== oldUser.name) {
      changes.name = { old: oldUser.name, new: updates.name };
    }
    if (updates.isAdmin !== undefined && updates.isAdmin !== oldUser.isAdmin) {
      changes.isAdmin = { old: oldUser.isAdmin, new: updates.isAdmin };
    }

    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: 'USER_UPDATED',
        details: {
          targetUserId: params.id,
          targetUserEmail: updatedUser.email,
          changes,
        }
      }
    });

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
    console.error('Error updating user:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'DATABASE_ERROR', 
        message: 'Failed to update user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete user and all associated data
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parse body first to get sessionId
    const body = await request.json();
    
    // Extract sessionId from body
    const sessionId = body.sessionId;
    if (!sessionId) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'No session ID provided' },
        { status: 401 }
      );
    }
    
    // Verify admin session using sessionId directly
    const session = await verifyAdminSessionById(sessionId);
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

    // Prevent self-deletion
    if (params.id === session.userId) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'Cannot delete your own account' },
        { status: 403 }
      );
    }

    // Validate request body
    const validation = deleteUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Confirmation required' },
        { status: 400 }
      );
    }

    // Get user to verify confirmation
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { email: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify confirmation matches email
    if (validation.data.confirmation !== user.email) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Confirmation does not match user email' },
        { status: 400 }
      );
    }

    // Delete user and all associated data using transaction
    try {
      await prisma.$transaction(async (tx) => {
        console.log(`Starting deletion of user ${params.id}`);
        
        // Delete related records in correct order to avoid foreign key constraints
        
        // First, delete records that reference this user
        console.log('Deleting calculations...');
        await tx.calculation.deleteMany({ where: { userId: params.id } });
        
        console.log('Deleting purchases...');
        await tx.purchase.deleteMany({ where: { userId: params.id } });
        
        console.log('Deleting collected arcana...');
        await tx.collectedArcana.deleteMany({ where: { userId: params.id } });
        
        console.log('Deleting password reset tokens...');
        await tx.passwordResetToken.deleteMany({ where: { userId: params.id } });
        
        console.log('Deleting email verification tokens...');
        await tx.emailVerificationToken.deleteMany({ where: { userId: params.id } });
        
        console.log('Deleting two factor auth...');
        await tx.twoFactorAuth.deleteMany({ where: { userId: params.id } });
        
        console.log('Deleting OAuth providers...');
        await tx.oAuthProvider.deleteMany({ where: { userId: params.id } });
        
        console.log('Deleting security logs...');
        await tx.securityLog.deleteMany({ where: { userId: params.id } });
        
        console.log('Deleting sessions...');
        await tx.session.deleteMany({ where: { userId: params.id } });
        
        // Delete orders (must be after purchases)
        console.log('Deleting orders...');
        await tx.order.deleteMany({ where: { userId: params.id } });
        
        // Update AdminLog to remove reference (set adminId to a system user or null)
        // Instead of deleting, we'll keep the logs but mark them as deleted user
        console.log('Updating admin logs...');
        const adminLogsCount = await tx.adminLog.count({ where: { adminId: params.id } });
        console.log(`Found ${adminLogsCount} admin logs to update`);
        
        if (adminLogsCount > 0) {
          await tx.adminLog.updateMany({
            where: { adminId: params.id },
            data: { 
              adminId: session.userId, // Transfer ownership to current admin
            }
          });
        }
        
        // Finally, delete the user
        console.log('Deleting user...');
        await tx.user.delete({ where: { id: params.id } });
        
        // Create audit log with current admin
        console.log('Creating audit log...');
        await tx.adminLog.create({
          data: {
            adminId: session.userId,
            action: 'USER_DELETED',
            details: {
              targetUserId: params.id,
              targetUserEmail: user.email,
              deletedAt: new Date().toISOString(),
            }
          }
        });
        
        console.log(`Successfully deleted user ${params.id}`);
      });
    } catch (transactionError) {
      console.error('Transaction error during user deletion:', transactionError);
      throw transactionError;
    }

    return NextResponse.json({
      success: true,
      deletedUserId: params.id,
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'DATABASE_ERROR', 
        message: 'Failed to delete user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
