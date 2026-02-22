/**
 * Tests for enhanced statistics endpoint
 */

import { GET } from '@/app/api/admin/statistics/route';
import { AdminService } from '@/lib/services/admin/AdminService';
import { authService } from '@/lib/services/auth/AuthService';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/services/admin/AdminService');
jest.mock('@/lib/services/auth/AuthService');

const mockAdminService = AdminService as jest.MockedClass<typeof AdminService>;
const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('GET /api/admin/statistics (Enhanced)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return enhanced statistics with default time range (30d)', async () => {
    const mockUser = { id: 'admin-123', email: 'admin@test.com', isAdmin: true };
    const mockEnhancedStats = {
      totalUsers: 100,
      totalCalculations: 500,
      totalOrders: 50,
      completedOrders: 45,
      totalRevenue: 5000,
      totalArticles: 20,
      recentUsers: 10,
      recentCalculations: 50,
      activeUsers7Days: 15,
      activeUsers30Days: 30,
      emailVerificationRate: 75.5,
      twoFactorAdoptionRate: 25.0,
      blockedUsersCount: 2,
      userGrowthData: [
        { date: '2024-01-01', value: 90 },
        { date: '2024-01-02', value: 95 },
      ],
      calculationTrendsData: [
        { date: '2024-01-01', value: 10 },
        { date: '2024-01-02', value: 15 },
      ],
      revenueTrendsData: [
        { date: '2024-01-01', value: 100.50 },
        { date: '2024-01-02', value: 150.75 },
      ],
      oauthUsageData: [
        { category: 'google', value: 30, percentage: 60 },
        { category: 'github', value: 20, percentage: 40 },
      ],
      generatedAt: new Date().toISOString(),
      timeRange: '30d',
    };

    mockAuthService.verifySession.mockResolvedValue(mockUser);
    mockAdminService.prototype.isAdmin.mockResolvedValue(true);
    mockAdminService.prototype.getEnhancedStatistics.mockResolvedValue(mockEnhancedStats);

    const request = new NextRequest('http://localhost:3000/api/admin/statistics?sessionId=test-session');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockEnhancedStats);
    expect(mockAdminService.prototype.getEnhancedStatistics).toHaveBeenCalledWith('30d', undefined, undefined);
  });

  it('should return enhanced statistics with 7d time range', async () => {
    const mockUser = { id: 'admin-123', email: 'admin@test.com', isAdmin: true };
    const mockEnhancedStats = {
      totalUsers: 100,
      totalCalculations: 500,
      totalOrders: 50,
      completedOrders: 45,
      totalRevenue: 5000,
      totalArticles: 20,
      recentUsers: 10,
      recentCalculations: 50,
      activeUsers7Days: 15,
      activeUsers30Days: 30,
      emailVerificationRate: 75.5,
      twoFactorAdoptionRate: 25.0,
      blockedUsersCount: 2,
      userGrowthData: [],
      calculationTrendsData: [],
      revenueTrendsData: [],
      oauthUsageData: [],
      generatedAt: new Date().toISOString(),
      timeRange: '7d',
    };

    mockAuthService.verifySession.mockResolvedValue(mockUser);
    mockAdminService.prototype.isAdmin.mockResolvedValue(true);
    mockAdminService.prototype.getEnhancedStatistics.mockResolvedValue(mockEnhancedStats);

    const request = new NextRequest('http://localhost:3000/api/admin/statistics?sessionId=test-session&timeRange=7d');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.timeRange).toBe('7d');
    expect(mockAdminService.prototype.getEnhancedStatistics).toHaveBeenCalledWith('7d', undefined, undefined);
  });

  it('should return enhanced statistics with custom date range', async () => {
    const mockUser = { id: 'admin-123', email: 'admin@test.com', isAdmin: true };
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const mockEnhancedStats = {
      totalUsers: 100,
      totalCalculations: 500,
      totalOrders: 50,
      completedOrders: 45,
      totalRevenue: 5000,
      totalArticles: 20,
      recentUsers: 10,
      recentCalculations: 50,
      activeUsers7Days: 15,
      activeUsers30Days: 30,
      emailVerificationRate: 75.5,
      twoFactorAdoptionRate: 25.0,
      blockedUsersCount: 2,
      userGrowthData: [],
      calculationTrendsData: [],
      revenueTrendsData: [],
      oauthUsageData: [],
      generatedAt: new Date().toISOString(),
      timeRange: `${startDate}_${endDate}`,
    };

    mockAuthService.verifySession.mockResolvedValue(mockUser);
    mockAdminService.prototype.isAdmin.mockResolvedValue(true);
    mockAdminService.prototype.getEnhancedStatistics.mockResolvedValue(mockEnhancedStats);

    const request = new NextRequest(
      `http://localhost:3000/api/admin/statistics?sessionId=test-session&timeRange=custom&startDate=${startDate}&endDate=${endDate}`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockAdminService.prototype.getEnhancedStatistics).toHaveBeenCalledWith(
      'custom',
      new Date(startDate),
      new Date(endDate)
    );
  });

  it('should return 400 for invalid time range', async () => {
    const mockUser = { id: 'admin-123', email: 'admin@test.com', isAdmin: true };

    mockAuthService.verifySession.mockResolvedValue(mockUser);
    mockAdminService.prototype.isAdmin.mockResolvedValue(true);

    const request = new NextRequest('http://localhost:3000/api/admin/statistics?sessionId=test-session&timeRange=invalid');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid timeRange parameter');
  });

  it('should return 400 for custom range without dates', async () => {
    const mockUser = { id: 'admin-123', email: 'admin@test.com', isAdmin: true };

    mockAuthService.verifySession.mockResolvedValue(mockUser);
    mockAdminService.prototype.isAdmin.mockResolvedValue(true);

    const request = new NextRequest('http://localhost:3000/api/admin/statistics?sessionId=test-session&timeRange=custom');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('startDate and endDate are required');
  });

  it('should return 400 when startDate is after endDate', async () => {
    const mockUser = { id: 'admin-123', email: 'admin@test.com', isAdmin: true };

    mockAuthService.verifySession.mockResolvedValue(mockUser);
    mockAdminService.prototype.isAdmin.mockResolvedValue(true);

    const request = new NextRequest(
      'http://localhost:3000/api/admin/statistics?sessionId=test-session&timeRange=custom&startDate=2024-01-31&endDate=2024-01-01'
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('startDate must be before endDate');
  });

  it('should return 401 for missing session', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/statistics');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 401 for invalid session', async () => {
    mockAuthService.verifySession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/admin/statistics?sessionId=invalid-session');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid session');
  });

  it('should return 403 for non-admin user', async () => {
    const mockUser = { id: 'user-123', email: 'user@test.com', isAdmin: false };

    mockAuthService.verifySession.mockResolvedValue(mockUser);
    mockAdminService.prototype.isAdmin.mockResolvedValue(false);

    const request = new NextRequest('http://localhost:3000/api/admin/statistics?sessionId=test-session');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toContain('Forbidden');
  });
});
