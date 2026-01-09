export type ChartType = 'bar' | 'radar' | 'line' | 'doughnut' | 'polarArea';
export type FortniteCategory = 'performance' | 'weapons' | 'playstyle' | 'loadout' | 'matches';

export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  category: FortniteCategory;
  data: ChartDataPoint[];
  createdAt: Date;
  showLegend: boolean;
  showGrid: boolean;
  animation: boolean;
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
}

export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  type: ChartType;
  category: FortniteCategory;
  defaultData: ChartDataPoint[];
}