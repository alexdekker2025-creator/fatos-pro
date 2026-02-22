/**
 * API endpoint for exporting admin data
 * POST /api/admin/export - generate and download CSV or Excel file
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/admin/AdminService';
import { authService } from '@/lib/services/auth/AuthService';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const adminService = new AdminService();

/**
 * Schema for export request validation
 */
const ExportRequestSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  format: z.enum(['csv', 'excel'], { errorMap: () => ({ message: 'Format must be csv or excel' }) }),
  dataType: z.enum(['users', 'statistics'], { errorMap: () => ({ message: 'Data type must be users or statistics' }) }),
  timeRange: z.enum(['7d', '30d', '90d', 'all', 'custom']).optional().default('30d'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  filters: z.object({
    emailVerified: z.boolean().optional(),
    twoFactorEnabled: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }).optional(),
});

type ExportRequest = z.infer<typeof ExportRequestSchema>;

/**
 * POST /api/admin/export
 * Generate and download data export in CSV or Excel format
 * 
 * Request body:
 * - sessionId: Session ID (required)
 * - format: Export format (csv or excel)
 * - dataType: Type of data to export (users or statistics)
 * - timeRange: Time range for statistics (7d, 30d, 90d, all, custom)
 * - startDate: Start date for custom range (ISO format)
 * - endDate: End date for custom range (ISO format)
 * - filters: Filters for user data export
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = ExportRequestSchema.parse(body);

    // Verify authentication
    const user = await authService.verifySession(validatedData.sessionId);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Verify admin privileges
    const isAdmin = await adminService.isAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Generate export based on data type
    let data: any[];
    let filename: string;

    if (validatedData.dataType === 'users') {
      data = await exportUsersData(validatedData.filters);
      filename = generateFilename('users', validatedData.timeRange, validatedData.format);
    } else {
      data = await exportStatisticsData(
        validatedData.timeRange,
        validatedData.startDate,
        validatedData.endDate
      );
      filename = generateFilename('statistics', validatedData.timeRange, validatedData.format);
    }

    // Generate file based on format
    if (validatedData.format === 'csv') {
      const csv = generateCSV(data);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } else {
      const excel = generateExcel(data, validatedData.dataType);
      // Convert Buffer to Uint8Array for NextResponse
      const uint8Array = new Uint8Array(excel);
      return new NextResponse(uint8Array, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error generating export:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Export users data with filters
 */
async function exportUsersData(filters?: {
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  isBlocked?: boolean;
  dateFrom?: string;
  dateTo?: string;
}): Promise<any[]> {
  const where: any = {};

  if (filters?.emailVerified !== undefined) {
    where.emailVerified = filters.emailVerified;
  }

  if (filters?.twoFactorEnabled !== undefined) {
    where.twoFactorEnabled = filters.twoFactorEnabled;
  }

  if (filters?.isBlocked !== undefined) {
    where.isBlocked = filters.isBlocked;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.createdAt.lte = new Date(filters.dateTo);
    }
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
      emailVerified: true as any,
      twoFactorEnabled: true as any,
      isBlocked: true as any,
      createdAt: true,
      preferredLang: true,
      _count: {
        select: {
          calculations: true,
          purchases: true,
        },
      },
      oauthProviders: {
        select: {
          provider: true,
        },
      },
      sessions: {
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    } as any,
    orderBy: {
      createdAt: 'desc',
    },
  }) as any[];

  // Transform data for export
  return users.map((user: any) => ({
    'User ID': user.id,
    'Email': user.email,
    'Name': user.name,
    'Is Admin': user.isAdmin ? 'Yes' : 'No',
    'Email Verified': user.emailVerified ? 'Yes' : 'No',
    '2FA Enabled': user.twoFactorEnabled ? 'Yes' : 'No',
    'Is Blocked': user.isBlocked ? 'Yes' : 'No',
    'Registration Date': user.createdAt.toISOString().split('T')[0],
    'Preferred Language': user.preferredLang,
    'Calculations Count': user._count.calculations,
    'Purchases Count': user._count.purchases,
    'OAuth Providers': user.oauthProviders.map((p: { provider: string }) => p.provider).join(', ') || 'None',
    'Last Login': user.sessions[0]?.createdAt.toISOString().split('T')[0] || 'Never',
  }));
}

/**
 * Export statistics data
 */
async function exportStatisticsData(
  timeRange: '7d' | '30d' | '90d' | 'all' | 'custom',
  startDate?: string,
  endDate?: string
): Promise<any[]> {
  const start = startDate ? new Date(startDate) : undefined;
  const end = endDate ? new Date(endDate) : undefined;

  const statistics = await adminService.getEnhancedStatistics(timeRange, start, end);

  // Create summary data
  const summaryData = [
    { 'Metric': 'Total Users', 'Value': statistics.totalUsers },
    { 'Metric': 'Total Calculations', 'Value': statistics.totalCalculations },
    { 'Metric': 'Total Orders', 'Value': statistics.totalOrders },
    { 'Metric': 'Completed Orders', 'Value': statistics.completedOrders },
    { 'Metric': 'Total Revenue', 'Value': statistics.totalRevenue },
    { 'Metric': 'Total Articles', 'Value': statistics.totalArticles },
    { 'Metric': 'Recent Users (30d)', 'Value': statistics.recentUsers },
    { 'Metric': 'Recent Calculations (30d)', 'Value': statistics.recentCalculations },
    { 'Metric': 'Active Users (7d)', 'Value': statistics.activeUsers7Days },
    { 'Metric': 'Active Users (30d)', 'Value': statistics.activeUsers30Days },
    { 'Metric': 'Email Verification Rate (%)', 'Value': statistics.emailVerificationRate },
    { 'Metric': '2FA Adoption Rate (%)', 'Value': statistics.twoFactorAdoptionRate },
    { 'Metric': 'Blocked Users', 'Value': statistics.blockedUsersCount },
  ];

  // Add time series data
  const timeSeriesData: any[] = [];
  
  // User growth data
  statistics.userGrowthData.forEach(point => {
    timeSeriesData.push({
      'Date': point.date,
      'User Growth': point.value,
      'Calculations': '',
      'Revenue': '',
    });
  });

  // Merge calculation trends
  statistics.calculationTrendsData.forEach((point, index) => {
    if (timeSeriesData[index]) {
      timeSeriesData[index]['Calculations'] = point.value;
    }
  });

  // Merge revenue trends
  statistics.revenueTrendsData.forEach((point, index) => {
    if (timeSeriesData[index]) {
      timeSeriesData[index]['Revenue'] = point.value;
    }
  });

  // Add OAuth usage data
  const oauthData = statistics.oauthUsageData.map(point => ({
    'OAuth Provider': point.category,
    'Users Count': point.value,
    'Percentage': point.percentage,
  }));

  // Combine all data
  return [
    ...summaryData,
    { 'Metric': '', 'Value': '' }, // Empty row separator
    { 'Metric': '=== Time Series Data ===', 'Value': '' },
    ...timeSeriesData,
    { 'Date': '', 'User Growth': '', 'Calculations': '', 'Revenue': '' }, // Empty row separator
    { 'Date': '=== OAuth Usage ===', 'User Growth': '', 'Calculations': '', 'Revenue': '' },
    ...oauthData.map(item => ({
      'Date': item['OAuth Provider'],
      'User Growth': item['Users Count'],
      'Calculations': item['Percentage'],
      'Revenue': '',
    })),
  ];
}

/**
 * Generate CSV from data
 */
function generateCSV(data: any[]): string {
  if (data.length === 0) {
    return '';
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = headers.map(h => `"${h}"`).join(',');
  
  // Create CSV data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes
      const stringValue = value === null || value === undefined ? '' : String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Generate Excel from data
 */
function generateExcel(data: any[], dataType: string): Buffer {
  // Create workbook
  const workbook = XLSX.utils.book_new();

  if (dataType === 'users') {
    // Single sheet for users
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  } else {
    // Multiple sheets for statistics
    // Separate summary, time series, and OAuth data
    const summaryData = data.filter(row => row['Metric'] && row['Metric'] !== '=== Time Series Data ===' && row['Metric'] !== '');
    const timeSeriesStart = data.findIndex(row => row['Date'] && row['Date'] !== '=== OAuth Usage ===');
    const oauthStart = data.findIndex(row => row['Date'] === '=== OAuth Usage ===') + 1;
    
    const timeSeriesData = data.slice(timeSeriesStart, oauthStart - 1).filter(row => row['Date'] && row['Date'] !== '');
    const oauthData = data.slice(oauthStart).filter(row => row['Date']);

    // Create sheets
    if (summaryData.length > 0) {
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    }

    if (timeSeriesData.length > 0) {
      const timeSeriesSheet = XLSX.utils.json_to_sheet(timeSeriesData);
      XLSX.utils.book_append_sheet(workbook, timeSeriesSheet, 'Time Series');
    }

    if (oauthData.length > 0) {
      // Transform OAuth data back to proper format
      const oauthFormatted = oauthData.map(row => ({
        'OAuth Provider': row['Date'],
        'Users Count': row['User Growth'],
        'Percentage': row['Calculations'],
      }));
      const oauthSheet = XLSX.utils.json_to_sheet(oauthFormatted);
      XLSX.utils.book_append_sheet(workbook, oauthSheet, 'OAuth Usage');
    }
  }

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

/**
 * Generate filename with timestamp
 */
function generateFilename(dataType: string, timeRange: string, format: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const extension = format === 'csv' ? 'csv' : 'xlsx';
  return `fatos-${dataType}-${timeRange}-${timestamp}.${extension}`;
}
