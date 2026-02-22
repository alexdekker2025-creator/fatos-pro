/**
 * Reusable Chart Wrapper Component with consistent styling
 */

'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartWrapperProps {
  title: string;
  type: 'line' | 'pie' | 'bar';
  data: any;
  options?: ChartOptions<any>;
  loading?: boolean;
  height?: number;
}

export default function ChartWrapper({
  title,
  type,
  data,
  options,
  loading = false,
  height = 300,
}: ChartWrapperProps) {
  const chartRef = useRef<any>(null);

  // Default options with mystical theme
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300, // Smooth but fast animations
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(147, 51, 234, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    ...(type === 'line' && {
      scales: {
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            maxTicksLimit: 10, // Limit x-axis labels for performance
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        y: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    }),
    // Disable animations on data updates for better performance
    transitions: {
      active: {
        animation: {
          duration: 0,
        },
      },
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line ref={chartRef} data={data} options={mergedOptions} />;
      case 'pie':
        return <Pie ref={chartRef} data={data} options={mergedOptions} />;
      case 'bar':
        return <Bar ref={chartRef} data={data} options={mergedOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      {loading ? (
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p className="text-white/50 text-sm">Loading chart...</p>
          </div>
        </div>
      ) : (
        <div style={{ height: `${height}px` }}>
          {renderChart()}
        </div>
      )}
    </div>
  );
}
