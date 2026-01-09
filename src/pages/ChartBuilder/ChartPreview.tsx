import React, { useRef, useMemo } from 'react';
import type { ChartConfig } from '../../types/chart.types';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Download, Maximize2 } from 'lucide-react';

ChartJS.register(...registerables);

interface Props {
  config: ChartConfig;
}

const ChartPreview: React.FC<Props> = ({ config }) => {
  const chartRef = useRef<ChartJS>(null);

  const chartData = useMemo(() => {
    return {
      labels: config.data.map(d => d.label),
      datasets: [{
        label: config.title,
        data: config.data.map(d => d.value),
        backgroundColor: config.data.map(d => `${d.color}80`),
        borderColor: config.data.map(d => d.color),
        borderWidth: 2,
        pointBackgroundColor: config.data.map(d => d.color),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }]
    };
  }, [config]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: config.showLegend,
          position: 'top' as const,
          labels: {
            color: config.textColor,
            font: {
              family: "'Inter', sans-serif",
              size: 12,
            },
          },
        },
        title: {
          display: true,
          text: config.title,
          color: config.textColor,
          font: {
            family: "'Inter', sans-serif",
            size: 18,
            weight: 'bold',
          },
          padding: {
            top: 20,
            bottom: 20,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: config.primaryColor,
          borderWidth: 1,
          cornerRadius: 8,
        },
      },
      scales: config.type !== 'doughnut' && config.type !== 'polarArea' ? {
        x: {
          grid: {
            display: config.showGrid,
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: config.textColor,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: config.showGrid,
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: config.textColor,
          },
        },
      } : {},
      animation: config.animation ? {
        duration: 1000,
        easing: 'easeInOutQuart',
      } : false,
    };
  }, [config]);

  const handleDownloadImage = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = `fortnite-chart-${config.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = chartRef.current.toBase64Image();
      link.click();
    }
  };

  const handleFullscreen = () => {
    const chartContainer = chartRef.current?.canvas?.parentElement;
    if (chartContainer) {
      if (chartContainer.requestFullscreen) {
        chartContainer.requestFullscreen();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Live Preview</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time chart visualization
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadImage}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            <Download size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Save as PNG</span>
            <span className="sm:hidden">Save</span>
          </button>

          <button
            onClick={handleFullscreen}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Fullscreen"
          >
            <Maximize2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6">
        <div className="relative h-[300px] sm:h-[350px] md:h-[400px] bg-white rounded-xl border border-gray-100 p-2 sm:p-4 shadow-inner">
          <Chart
            ref={chartRef}
            type={config.type}
            data={chartData}
            options={chartOptions}
            height={400}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            <span className="text-blue-600 text-sm sm:text-base">💡</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="font-semibold">Tip:</span> {getTipForChartType(config.type)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Use {config.showGrid ? 'grid lines' : 'clean layout'} for {config.showGrid ? 'precision' : 'minimalism'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTipForChartType = (type: string): string => {
  const tips: Record<string, string> = {
    bar: 'Perfect for comparing weapon stats or season performances side-by-side',
    radar: 'Great for showing your balanced skills across different categories',
    line: 'Ideal for tracking your progress over multiple matches or seasons',
    doughnut: 'Best for showing percentage-based data like loadout composition',
    polarArea: 'Excellent for directional analysis like playstyle tendencies',
  };
  return tips[type] || 'Choose the right chart type to best represent your Fortnite data';
};

export default ChartPreview;