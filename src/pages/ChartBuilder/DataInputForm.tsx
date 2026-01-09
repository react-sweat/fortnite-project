import React, { useState, useEffect } from 'react';
import type { ChartType, FortniteCategory } from '../../types/chart.types';
import { Plus, Trash2, Palette, Zap, Search, Loader2 } from 'lucide-react';
import { useFortniteApi } from '../../hooks/useFortniteApi';
import type { PlayerStats } from '../../types/fortnitedto';

interface Props {
  currentConfig: import('../../types/chart.types').ChartConfig;
  onSubmit: (title: string, chartType: ChartType, category: FortniteCategory, dataPoints: import('../../types/chart.types').ChartDataPoint[]) => void;
}

const DataInputForm: React.FC<Props> = ({ currentConfig, onSubmit }) => {
  const [title, setTitle] = useState(currentConfig.title);
  const [chartType, setChartType] = useState<ChartType>(currentConfig.type);
  const [category, setCategory] = useState<FortniteCategory>(currentConfig.category);
  const [dataPoints, setDataPoints] = useState<import('../../types/chart.types').ChartDataPoint[]>(currentConfig.data);
  const [fortniteUsername, setFortniteUsername] = useState('');
  const [searchParams, setSearchParams] = useState<{ name: string } | null>(null);

  const { data: playerStats, loading: statsLoading, error: statsError } = useFortniteApi<PlayerStats>(
    '/v2/stats/br/v2',
    searchParams
  );

  useEffect(() => {
    if (playerStats) {
      const stats = playerStats.stats.all.overall;
      const newDataPoints = [
        { label: 'K/D Ratio', value: stats.kd, color: '#ef4444' },
        { label: 'Win Rate %', value: stats.winRate, color: '#3b82f6' },
        { label: 'Top 10 Rate', value: (stats.wins / stats.matches) * 100, color: '#f59e0b' },
        { label: 'Avg Kills', value: stats.kills / stats.matches, color: '#10b981' },
        { label: 'Score/Match', value: stats.score / stats.matches, color: '#8b5cf6' },
      ];
      const newTitle = `${playerStats.account.name}'s Stats`;

      setDataPoints(newDataPoints);
      setTitle(newTitle);

      onSubmit(newTitle, chartType, category, newDataPoints);
      setSearchParams(null);
    }
  }, [playerStats]);

  const chartTypes = [
    { value: 'bar', label: 'BAR CHART', icon: '📊' },
    { value: 'radar', label: 'RADAR CHART', icon: '🎯' },
    { value: 'line', label: 'LINE CHART', icon: '📈' },
    { value: 'doughnut', label: 'DOUGHNUT', icon: '🍩' },
    { value: 'polarArea', label: 'POLAR AREA', icon: '🌀' },
  ];

  const categories = [
    { value: 'performance', label: 'Performance Stats', color: 'bg-blue-500' },
    { value: 'weapons', label: 'Weapon Comparison', color: 'bg-red-500' },
    { value: 'playstyle', label: 'Playstyle Analysis', color: 'bg-green-500' },
    { value: 'loadout', label: 'Loadout Rating', color: 'bg-purple-500' },
    { value: 'matches', label: 'Match History', color: 'bg-yellow-500' },
  ];

  const fortnitePresets = {
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

  const handleAddDataPoint = () => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    const newPoint = {
      label: `Stat ${dataPoints.length + 1}`,
      value: 50,
      color: colors[dataPoints.length % colors.length],
    };
    setDataPoints([...dataPoints, newPoint]);
  };

  const handleRemoveDataPoint = (index: number) => {
    if (dataPoints.length > 1) {
      setDataPoints(dataPoints.filter((_p: import('../../types/chart.types').ChartDataPoint, i: number) => i !== index));
    }
  };

  const handleUpdateDataPoint = (index: number, field: keyof import('../../types/chart.types').ChartDataPoint, value: string | number) => {
    const newData = [...dataPoints];
    newData[index] = { ...newData[index], [field]: value };
    setDataPoints(newData);
  };

  const handleLoadPreset = () => {
    const preset = fortnitePresets[category] || fortnitePresets.performance;
    setDataPoints([...preset]);
  };

  const handleSearchStats = () => {
    if (fortniteUsername.trim()) {
      setSearchParams({ name: fortniteUsername.trim() });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, chartType, category, dataPoints);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Basics</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter chart title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {chartTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setChartType(type.value as ChartType)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${chartType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FortniteCategory)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Data Points</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleLoadPreset}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Zap size={16} />
              Load Preset
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Import from Fortnite Player
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={fortniteUsername}
              onChange={(e) => setFortniteUsername(e.target.value)}
              placeholder="Enter Epic Username..."
              className="flex-1 px-4 py-2 bg-white border border-blue-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchStats())}
            />
            <button
              type="button"
              onClick={handleSearchStats}
              disabled={statsLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {statsLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Search
            </button>
          </div>
          {statsError && <p className="text-red-500 text-sm mt-2">{statsError}</p>}
        </div>

        <div className="space-y-3 mb-4">
          {dataPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <input
                type="text"
                value={point.label}
                onChange={(e) => handleUpdateDataPoint(index, 'label', e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:border-blue-500 outline-none"
                placeholder="Stat name"
              />

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 min-w-[40px]">{typeof point.value === 'number' ? point.value.toFixed(1) : point.value}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={point.value}
                  onChange={(e) => handleUpdateDataPoint(index, 'value', parseInt(e.target.value))}
                  className="w-24"
                />
              </div>

              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors shadow-sm" style={{ backgroundColor: point.color }}>
                <input
                  type="color"
                  value={point.color}
                  onChange={(e) => handleUpdateDataPoint(index, 'color', e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  title="Choose color"
                />
                <Palette size={20} className={`text-white drop-shadow-md`} />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveDataPoint(index)}
                disabled={dataPoints.length <= 1}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddDataPoint}
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all"
        >
          <Plus size={16} />
          Add Data Point
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
      >
        🚀 Generate Chart
      </button>
    </form>
  );
};

export default DataInputForm;