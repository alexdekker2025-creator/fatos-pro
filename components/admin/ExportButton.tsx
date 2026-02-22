/**
 * Export Button Component for CSV and Excel exports
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ExportButtonProps {
  format: 'csv' | 'excel';
  timeRange: string;
  customDateRange?: { start: string; end: string };
}

export default function ExportButton({ format, timeRange, customDateRange }: ExportButtonProps) {
  const t = useTranslations('admin.statistics');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      
      const sessionId = localStorage.getItem('sessionId');
      
      const requestBody: any = {
        sessionId,
        format,
        dataType: 'statistics',
        timeRange,
      };

      if (timeRange === 'custom' && customDateRange) {
        requestBody.startDate = customDateRange.start;
        requestBody.endDate = customDateRange.end;
      }

      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `fatos-statistics-${timeRange}-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert(t('exportError', { default: 'Failed to export data. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
        loading
          ? 'bg-white/10 text-white/50 cursor-not-allowed'
          : 'bg-purple-600 text-white hover:bg-purple-700'
      }`}
      title={format === 'csv' ? t('exportCSV', { default: 'Export to CSV' }) : t('exportExcel', { default: 'Export to Excel' })}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>{t('exporting', { default: 'Exporting...' })}</span>
        </>
      ) : (
        <>
          <span>{format === 'csv' ? '📄' : '📊'}</span>
          <span>{format === 'csv' ? 'CSV' : 'Excel'}</span>
        </>
      )}
    </button>
  );
}
