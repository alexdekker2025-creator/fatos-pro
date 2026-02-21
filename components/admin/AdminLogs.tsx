/**
 * Компонент для отображения логов действий администратора
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  details: any;
  createdAt: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export default function AdminLogs() {
  const t = useTranslations('admin.logs');
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    limit: 50,
  });

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/admin/logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE_ARTICLE':
        return 'bg-green-500/30 text-green-200';
      case 'UPDATE_ARTICLE':
        return 'bg-blue-500/30 text-blue-200';
      case 'DELETE_ARTICLE':
        return 'bg-red-500/30 text-red-200';
      default:
        return 'bg-gray-500/30 text-gray-200';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE_ARTICLE':
        return t('actionCreate', { default: 'Created Article' });
      case 'UPDATE_ARTICLE':
        return t('actionUpdate', { default: 'Updated Article' });
      case 'DELETE_ARTICLE':
        return t('actionDelete', { default: 'Deleted Article' });
      default:
        return action;
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и фильтры */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {t('title', { default: 'Admin Activity Logs' })}
        </h2>
        <div className="flex gap-4">
          <select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">{t('allActions', { default: 'All Actions' })}</option>
            <option value="CREATE_ARTICLE">Create Article</option>
            <option value="UPDATE_ARTICLE">Update Article</option>
            <option value="DELETE_ARTICLE">Delete Article</option>
          </select>
          <select
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
            className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="20">20 {t('items', { default: 'items' })}</option>
            <option value="50">50 {t('items', { default: 'items' })}</option>
            <option value="100">100 {t('items', { default: 'items' })}</option>
          </select>
        </div>
      </div>

      {/* Список логов */}
      {loading ? (
        <div className="text-center text-white py-8">
          {t('loading', { default: 'Loading logs...' })}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center text-white/70 py-8">
          {t('noLogs', { default: 'No logs found' })}
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                    <span className="text-white/70 text-sm">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  <div className="text-white mb-2">
                    <span className="text-white/70">{t('by', { default: 'By' })}:</span>{' '}
                    <span className="font-medium">{log.admin.name}</span>{' '}
                    <span className="text-white/50">({log.admin.email})</span>
                  </div>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-white/70 text-sm cursor-pointer hover:text-white">
                        {t('viewDetails', { default: 'View Details' })}
                      </summary>
                      <pre className="mt-2 p-3 bg-black/30 rounded text-white/80 text-xs overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
