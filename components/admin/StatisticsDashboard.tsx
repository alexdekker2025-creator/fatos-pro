/**
 * Enhanced Statistics Dashboard with Charts and Time Range Filtering
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ChartWrapper from './ChartWrapper';
import ExportButton from './ExportButton';

interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

interface CategoryDataPoint {
  category: string;
  value: number;
}

interface EnhancedStatistics {
  // Basic metrics
  totalUsers: number;
  totalCalculations: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalArticles: number;
  recentUsers: number;
  recentCalculations: number;
  
  // New metrics
  activeUsers7Days: number;
  activeUsers30Days: number;
  emailVerificationRate: number;
  twoFactorAdoptionRate: number;
  blockedUsersCount: number;
  
  // Chart data
  userGrowthData: TimeSeriesDataPoint[];
  calculationTrendsData: TimeSeriesDataPoint[];
  revenueTrendsData: TimeSeriesDataPoint[];
  oauthUsageData: CategoryDataPoint[];
  
  // Metadata
  generatedAt: string;
  timeRange: string;
}

type TimeRange = '7d' | '30d' | '90d' | 'all' | 'custom';

export default function StatisticsDashboard() {
  const t = useTranslations('admin.statistics');
  const [stats, setStats] = useState<EnhancedStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [pollingError, setPollingError] = useState(false);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setPollingError(false);
      
      const sessionId = localStorage.getItem('sessionId');
      let url = `/api/admin/statistics?sessionId=${sessionId}&timeRange=${timeRange}`;
      
      if (timeRange === 'custom' && customDateRange.start && customDateRange.end) {
        url += `&startDate=${customDateRange.start}&endDate=${customDateRange.end}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastUpdated(new Date());
      } else {
        console.error('Failed to load statistics:', response.status, response.statusText);
        setPollingError(true);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      setPollingError(true);
    } finally {
      setLoading(false);
    }
  }, [timeRange, customDateRange]);

  // Initial load
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadStatistics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, loadStatistics]);

  // Retry after 60 seconds on error
  useEffect(() => {
    if (!pollingError) return;

    const timeout = setTimeout(() => {
      loadStatistics();
    }, 60000); // 60 seconds

    return () => clearTimeout(timeout);
  }, [pollingError, loadStatistics]);

  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
    // Store in session storage for persistence
    sessionStorage.setItem('admin_stats_timeRange', newRange);
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    setCustomDateRange(prev => ({ ...prev, [field]: value }));
  };

  const applyCustomDateRange = () => {
    if (!customDateRange.start || !customDateRange.end) {
      alert(t('errors.dateRangeRequired', { default: 'Please select both start and end dates' }));
      return;
    }

    const start = new Date(customDateRange.start);
    const end = new Date(customDateRange.end);

    if (start >= end) {
      alert(t('errors.invalidDateRange', { default: 'Start date must be before end date' }));
      return;
    }

    setTimeRange('custom');
    sessionStorage.setItem('admin_stats_timeRange', 'custom');
    sessionStorage.setItem('admin_stats_customStart', customDateRange.start);
    sessionStorage.setItem('admin_stats_customEnd', customDateRange.end);
  };

  // Restore time range from session storage on mount
  useEffect(() => {
    const savedRange = sessionStorage.getItem('admin_stats_timeRange') as TimeRange;
    if (savedRange) {
      setTimeRange(savedRange);
      if (savedRange === 'custom') {
        const savedStart = sessionStorage.getItem('admin_stats_customStart');
        const savedEnd = sessionStorage.getItem('admin_stats_customEnd');
        if (savedStart && savedEnd) {
          setCustomDateRange({ start: savedStart, end: savedEnd });
        }
      }
    }
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">{t('loading', { default: 'Loading statistics...' })}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-white/70 py-8">
        {t('error', { default: 'Failed to load statistics' })}
      </div>
    );
  }

  const statCards = [
    {
      title: t('totalUsers', { default: 'Total Users' }),
      value: stats.totalUsers.toLocaleString(),
      recent: stats.recentUsers,
      recentLabel: t('last30Days', { default: 'Last 30 days' }),
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: t('activeUsers7d', { default: 'Active Users (7d)' }),
      value: stats.activeUsers7Days.toLocaleString(),
      icon: '🔥',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: t('activeUsers30d', { default: 'Active Users (30d)' }),
      value: stats.activeUsers30Days.toLocaleString(),
      icon: '⚡',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: t('totalCalculations', { default: 'Total Calculations' }),
      value: stats.totalCalculations.toLocaleString(),
      recent: stats.recentCalculations,
      recentLabel: t('last30Days', { default: 'Last 30 days' }),
      icon: '🔢',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: t('totalRevenue', { default: 'Total Revenue' }),
      value: `${stats.totalRevenue.toLocaleString()} ₽`,
      subtitle: t('fromCompletedOrders', { default: 'From completed orders' }),
      icon: '💰',
      color: 'from-green-500 to-green-600',
    },
    {
      title: t('emailVerificationRate', { default: 'Email Verification Rate' }),
      value: `${stats.emailVerificationRate.toFixed(1)}%`,
      icon: '✉️',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: t('twoFactorAdoptionRate', { default: '2FA Adoption Rate' }),
      value: `${stats.twoFactorAdoptionRate.toFixed(1)}%`,
      icon: '🔐',
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: t('blockedUsers', { default: 'Blocked Users' }),
      value: stats.blockedUsersCount.toLocaleString(),
      icon: '🚫',
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Time Range Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {t('title', { default: 'Platform Statistics' })}
          </h2>
          {lastUpdated && (
            <p className="text-sm text-white/50 mt-1">
              {t('lastUpdated', { default: 'Last updated' })}: {lastUpdated.toLocaleTimeString()}
              {pollingError && (
                <span className="ml-2 text-yellow-400">⚠️ {t('staleData', { default: 'Data may be stale' })}</span>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {t(`timeRange.${range}`, { default: range.toUpperCase() })}
              </button>
            ))}
          </div>

          {/* Custom Date Range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:border-purple-500 focus:outline-none"
            />
            <span className="text-white/50">-</span>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={applyCustomDateRange}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all"
            >
              {t('apply', { default: 'Apply' })}
            </button>
          </div>

          {/* Export Buttons */}
          <ExportButton
            format="csv"
            timeRange={timeRange}
            customDateRange={timeRange === 'custom' ? customDateRange : undefined}
          />
          <ExportButton
            format="excel"
            timeRange={timeRange}
            customDateRange={timeRange === 'custom' ? customDateRange : undefined}
          />

          {/* Auto-refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              autoRefresh
                ? 'bg-green-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
            title={autoRefresh ? t('autoRefreshOn', { default: 'Auto-refresh ON' }) : t('autoRefreshOff', { default: 'Auto-refresh OFF' })}
          >
            {autoRefresh ? '🔄' : '⏸️'}
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-white/70 text-xs mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`text-3xl bg-gradient-to-br ${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            {card.subtitle && (
              <p className="text-white/50 text-xs">{card.subtitle}</p>
            )}
            {card.recent !== undefined && (
              <div className="mt-2 pt-2 border-t border-white/20">
                <p className="text-white/70 text-xs">
                  <span className="text-green-300 font-semibold">+{card.recent}</span>{' '}
                  {card.recentLabel}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <ChartWrapper
          title={t('userGrowth', { default: 'User Growth' })}
          type="line"
          data={{
            labels: stats.userGrowthData.map(d => new Date(d.date).toLocaleDateString()),
            datasets: [{
              label: t('users', { default: 'Users' }),
              data: stats.userGrowthData.map(d => d.value),
              borderColor: 'rgb(147, 51, 234)',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              fill: true,
              tension: 0.4,
            }]
          }}
          loading={loading}
        />

        {/* Calculation Trends Chart */}
        <ChartWrapper
          title={t('calculationTrends', { default: 'Calculation Trends' })}
          type="line"
          data={{
            labels: stats.calculationTrendsData.map(d => new Date(d.date).toLocaleDateString()),
            datasets: [{
              label: t('calculations', { default: 'Calculations' }),
              data: stats.calculationTrendsData.map(d => d.value),
              borderColor: 'rgb(99, 102, 241)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              fill: true,
              tension: 0.4,
            }]
          }}
          loading={loading}
        />

        {/* Revenue Trends Chart */}
        <ChartWrapper
          title={t('revenueTrends', { default: 'Revenue Trends' })}
          type="line"
          data={{
            labels: stats.revenueTrendsData.map(d => new Date(d.date).toLocaleDateString()),
            datasets: [{
              label: t('revenue', { default: 'Revenue (₽)' }),
              data: stats.revenueTrendsData.map(d => d.value),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4,
            }]
          }}
          loading={loading}
        />

        {/* OAuth Usage Chart */}
        <ChartWrapper
          title={t('oauthUsage', { default: 'OAuth Usage' })}
          type="pie"
          data={{
            labels: stats.oauthUsageData.map(d => d.category),
            datasets: [{
              data: stats.oauthUsageData.map(d => d.value),
              backgroundColor: [
                'rgba(147, 51, 234, 0.8)',
                'rgba(99, 102, 241, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(234, 179, 8, 0.8)',
                'rgba(239, 68, 68, 0.8)',
              ],
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 2,
            }]
          }}
          loading={loading}
        />
      </div>

      {/* Additional Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {t('overview', { default: 'Overview' })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-white/70 text-sm mb-1">
              {t('conversionRate', { default: 'Order Conversion Rate' })}
            </p>
            <p className="text-2xl font-bold text-white">
              {stats.totalOrders > 0
                ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-1">
              {t('avgRevenue', { default: 'Average Revenue per Order' })}
            </p>
            <p className="text-2xl font-bold text-white">
              {stats.completedOrders > 0
                ? (stats.totalRevenue / stats.completedOrders).toFixed(0)
                : 0} ₽
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-1">
              {t('calcPerUser', { default: 'Calculations per User' })}
            </p>
            <p className="text-2xl font-bold text-white">
              {stats.totalUsers > 0
                ? (stats.totalCalculations / stats.totalUsers).toFixed(1)
                : 0}
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-1">
              {t('recentGrowth', { default: 'Recent Growth Rate' })}
            </p>
            <p className="text-2xl font-bold text-white">
              {stats.totalUsers > 0
                ? ((stats.recentUsers / stats.totalUsers) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
