import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { ChartConfig, ChartType, FortniteCategory, ChartTemplate, ChartDataPoint } from '../../types/chart.types';
import ChartPreview from './ChartPreview';
import DataInputForm from './DataInputForm';
import ChartControls from './ChartControls';
import { Share2, Download, Copy, RotateCcw } from 'lucide-react';

const generateDefaultData = (category: FortniteCategory) => {
  const defaultData: Record<FortniteCategory, ChartDataPoint[]> = {
    performance: [
      { label: 'K/D Ratio', value: 2.1, color: '#ef4444' },
      { label: 'Win Rate %', value: 12.5, color: '#3b82f6' },
      { label: 'Avg Kills', value: 4.2, color: '#10b981' },
      { label: 'Top 10 Rate', value: 35, color: '#f59e0b' },
      { label: 'Avg Damage', value: 450, color: '#8b5cf6' },
    ],
    weapons: [
      { label: 'Striker AR', value: 85, color: '#ef4444' },
      { label: 'Nemesis AR', value: 78, color: '#3b82f6' },
      { label: 'Pump Shotgun', value: 92, color: '#10b981' },
      { label: 'Ranger Pistol', value: 65, color: '#f59e0b' },
      { label: 'Sniper Rifle', value: 88, color: '#8b5cf6' },
    ],
    playstyle: [
      { label: 'Aggression', value: 75, color: '#ef4444' },
      { label: 'Survival', value: 60, color: '#3b82f6' },
      { label: 'Mobility', value: 45, color: '#10b981' },
      { label: 'Strategy', value: 80, color: '#f59e0b' },
      { label: 'Versatility', value: 70, color: '#8b5cf6' },
    ],
    loadout: [
      { label: 'Damage', value: 85, color: '#ef4444' },
      { label: 'Mobility', value: 60, color: '#3b82f6' },
      { label: 'Healing', value: 75, color: '#10b981' },
      { label: 'Range', value: 50, color: '#f59e0b' },
      { label: 'Versatility', value: 90, color: '#8b5cf6' },
    ],
    matches: [
      { label: 'Match 1', value: 3, color: '#ef4444' },
      { label: 'Match 2', value: 5, color: '#3b82f6' },
      { label: 'Match 3', value: 2, color: '#10b981' },
      { label: 'Match 4', value: 7, color: '#f59e0b' },
      { label: 'Match 5', value: 4, color: '#8b5cf6' },
    ],
  };

  return defaultData[category] || defaultData.performance;
};

const templates: ChartTemplate[] = [
  {
    id: 'performance-overview',
    name: 'Season Performance',
    description: 'Track your key stats from this season',
    type: 'bar',
    category: 'performance',
    defaultData: [
      { label: 'K/D Ratio', value: 2.1, color: '#ef4444' },
      { label: 'Win Rate %', value: 12, color: '#3b82f6' },
      { label: 'Avg Kills', value: 4.5, color: '#10b981' },
      { label: 'Top 10 Rate', value: 35, color: '#f59e0b' },
      { label: 'Avg Survival', value: 12, color: '#8b5cf6' },
    ]
  },
  {
    id: 'weapon-mastery',
    name: 'Weapon Mastery',
    description: 'Compare your proficiency with different weapons',
    type: 'radar',
    category: 'weapons',
    defaultData: [
      { label: 'AR Accuracy', value: 75, color: '#ef4444' },
      { label: 'Shotgun Kills', value: 85, color: '#3b82f6' },
      { label: 'Sniper Headshots', value: 60, color: '#10b981' },
      { label: 'SMG Spray', value: 70, color: '#f59e0b' },
      { label: 'Pistol Precision', value: 65, color: '#8b5cf6' },
    ]
  },
  {
    id: 'playstyle-dna',
    name: 'Playstyle DNA',
    description: 'Analyze your gameplay approach and tendencies',
    type: 'doughnut',
    category: 'playstyle',
    defaultData: [
      { label: 'Aggressor', value: 40, color: '#ef4444' },
      { label: 'Strategist', value: 30, color: '#3b82f6' },
      { label: 'Survivalist', value: 20, color: '#10b981' },
      { label: 'Sniper', value: 10, color: '#f59e0b' },
    ]
  },
  {
    id: 'loadout-rating',
    name: 'Loadout Rating',
    description: 'Rate your current loadout balance and effectiveness',
    type: 'polarArea',
    category: 'loadout',
    defaultData: [
      { label: 'Damage Output', value: 85, color: '#ef4444' },
      { label: 'Mobility', value: 60, color: '#3b82f6' },
      { label: 'Healing Capacity', value: 75, color: '#10b981' },
      { label: 'Range Coverage', value: 50, color: '#f59e0b' },
      { label: 'Versatility', value: 90, color: '#8b5cf6' },
    ]
  },
  {
    id: 'match-progression',
    name: 'Match Progression',
    description: 'Track your performance across recent matches',
    type: 'line',
    category: 'matches',
    defaultData: [
      { label: 'Match 1', value: 3, color: '#ef4444' },
      { label: 'Match 2', value: 5, color: '#3b82f6' },
      { label: 'Match 3', value: 2, color: '#10b981' },
      { label: 'Match 4', value: 7, color: '#f59e0b' },
      { label: 'Match 5', value: 4, color: '#8b5cf6' },
    ]
  },
];

const ChartBuilderPage: React.FC = () => {
  const { encoded } = useParams<{ encoded: string }>();

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    id: '1',
    title: 'My Fortnite Stats',
    type: 'bar',
    category: 'performance',
    data: generateDefaultData('performance'),
    createdAt: new Date(),
    showLegend: true,
    showGrid: true,
    animation: true,
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    primaryColor: '#3b82f6',
  });

  useEffect(() => {
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        setChartConfig(decoded);
      } catch (error) {
        console.error('Failed to decode chart config:', error);
        alert('Invalid share link.');
      }
    }
  }, [encoded]);

  const [activeTab, setActiveTab] = useState<'create' | 'customize' | 'templates'>('create');

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setChartConfig((prev: ChartConfig) => ({
        ...prev,
        title: template.name,
        type: template.type,
        category: template.category,
        data: template.defaultData,
      }));
    }
  };

  const handleUpdateData = (title: string, chartType: ChartType, category: FortniteCategory, dataPoints: ChartDataPoint[]) => {
    setChartConfig((prev: ChartConfig) => ({
      ...prev,
      title,
      type: chartType,
      category,
      data: dataPoints,
    }));
  };

  const handleExport = async (format: 'png' | 'json') => {
    if (format === 'json') {
      const jsonStr = JSON.stringify(chartConfig, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fortnite-chart-${chartConfig.title.toLowerCase().replace(/\s+/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(chartConfig, null, 2));
    alert('Configuration copied to clipboard!');
  };

  const handleResetData = () => {
    setChartConfig((prev: ChartConfig) => ({
      ...prev,
      data: generateDefaultData(prev.category),
    }));
    alert('Data reset to defaults.');
  };

  const getShareableLink = () => {
    const encoded = btoa(JSON.stringify(chartConfig));
    return `${window.location.origin}/chart/${encoded}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 text-gray-900">
      <div className="max-w-7xl mx-auto">

        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2 sm:mb-3 px-2">
            🎮 Fortnite Chart Builder
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">
            Create custom visualizations of your stats, loadouts, and playstyle
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

          <div className="lg:w-5/12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

              <div className="flex border-b border-gray-100 overflow-x-auto">
                <button
                  className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'create'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  onClick={() => setActiveTab('create')}
                >
                  📊 Create
                </button>
                <button
                  className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'customize'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  onClick={() => setActiveTab('customize')}
                >
                  🎨 Customize
                </button>
                <button
                  className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'templates'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  onClick={() => setActiveTab('templates')}
                >
                  📋 Templates
                </button>
              </div>

              <div className="p-4 sm:p-5 md:p-6">
                {activeTab === 'create' && (
                  <DataInputForm
                    currentConfig={chartConfig}
                    onSubmit={handleUpdateData}
                  />
                )}

                {activeTab === 'customize' && (
                  <ChartControls
                    config={chartConfig}
                    onUpdate={setChartConfig}
                  />
                )}

                {activeTab === 'templates' && (
                  <div className="space-y-4">
                    {templates.map(template => (
                      <div
                        key={template.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-500 cursor-pointer transition-all hover:scale-[1.02]"
                        onClick={() => handleApplyTemplate(template.id)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl">{getIconByType(template.type)}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                              {template.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-6 bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={handleCopyConfig}
                  className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors text-xs sm:text-sm"
                >
                  <Copy size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Copy Config</span>
                  <span className="sm:hidden">Copy</span>
                </button>
                <button
                  onClick={handleResetData}
                  className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors text-xs sm:text-sm"
                >
                  <RotateCcw size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Reset Data</span>
                  <span className="sm:hidden">Reset</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors text-xs sm:text-sm"
                >
                  <Download size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Export JSON</span>
                  <span className="sm:hidden">Export</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getShareableLink());
                    alert('Share link copied to clipboard!');
                  }}
                  className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors text-xs sm:text-sm"
                >
                  <Share2 size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Share Link</span>
                  <span className="sm:hidden">Share</span>
                </button>
              </div>
            </div>
          </div>


          <div className="lg:w-2/3">
            <ChartPreview
              config={chartConfig}
            />

            <div className="mt-4 sm:mt-6 bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{chartConfig.data.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Data Points</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {chartConfig.data.reduce((sum: number, d: ChartDataPoint) => sum + d.value, 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">Total Value</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600 capitalize">{chartConfig.type}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Chart Type</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">{chartConfig.category}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Category</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getIconByType = (type: ChartType): string => {
  const icons: Record<ChartType, string> = {
    bar: '📊',
    radar: '🎯',
    line: '📈',
    doughnut: '🍩',
    polarArea: '🌀'
  };
  return icons[type];
};

export default ChartBuilderPage;