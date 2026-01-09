import type { ChartDataPoint, FortniteCategory, ChartType } from '../types/chart.types';

export const generateDefaultData = (category: FortniteCategory, type: ChartType): ChartDataPoint[] => {
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

export const getRandomColor = (): string => {
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateChartId = (): string => {
  return `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};