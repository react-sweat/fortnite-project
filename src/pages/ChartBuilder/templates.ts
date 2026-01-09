import type { ChartTemplate } from '../../types/chart.types';

export const templates: ChartTemplate[] = [
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
  {
    id: 'fortnite-skills',
    name: 'Fortnite Skills',
    description: 'Rate your core Fortnite skills',
    type: 'bar',
    category: 'playstyle',
    defaultData: [
      { label: 'Building', value: 70, color: '#ef4444' },
      { label: 'Editing', value: 65, color: '#3b82f6' },
      { label: 'Aiming', value: 85, color: '#10b981' },
      { label: 'Positioning', value: 75, color: '#f59e0b' },
      { label: 'Game Sense', value: 80, color: '#8b5cf6' },
    ]
  },
  {
    id: 'game-mode-preference',
    name: 'Game Mode Preference',
    description: 'Your performance across different game modes',
    type: 'doughnut',
    category: 'performance',
    defaultData: [
      { label: 'Battle Royale', value: 45, color: '#ef4444' },
      { label: 'Zero Build', value: 35, color: '#3b82f6' },
      { label: 'Creative', value: 15, color: '#10b981' },
      { label: 'Tournaments', value: 5, color: '#f59e0b' },
    ]
  },
  {
    id: 'weekly-progress',
    name: 'Weekly Progress',
    description: 'Track your improvement over the past week',
    type: 'line',
    category: 'matches',
    defaultData: [
      { label: 'Monday', value: 65, color: '#ef4444' },
      { label: 'Tuesday', value: 70, color: '#3b82f6' },
      { label: 'Wednesday', value: 68, color: '#10b981' },
      { label: 'Thursday', value: 75, color: '#f59e0b' },
      { label: 'Friday', value: 80, color: '#8b5cf6' },
      { label: 'Saturday', value: 85, color: '#ec4899' },
      { label: 'Sunday', value: 82, color: '#14b8a6' },
    ]
  }
];

export const getTemplateById = (id: string): ChartTemplate | undefined => {
  return templates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): ChartTemplate[] => {
  return templates.filter(template => template.category === category);
};