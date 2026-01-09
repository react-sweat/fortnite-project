import React from 'react';
import type { ChartConfig } from '../../types/chart.types';
import { ToggleLeft, Grid, Zap, Palette, Type } from 'lucide-react';

interface Props {
  config: ChartConfig;
  onUpdate: (config: ChartConfig) => void;
}

const ChartControls: React.FC<Props> = ({ config, onUpdate }) => {
  const handleToggle = (key: keyof ChartConfig, value: boolean) => {
    onUpdate({ ...config, [key]: value });
  };

  const handleColorChange = (key: keyof ChartConfig, color: string) => {
    onUpdate({ ...config, [key]: color });
  };



  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap size={20} />
          Display Options
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <ToggleLeft className="text-gray-500" />
              <div>
                <p className="text-gray-900 font-medium">Show Legend</p>
                <p className="text-xs text-gray-500">Display chart legend</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.showLegend}
                onChange={(e) => handleToggle('showLegend', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <Grid className="text-gray-500" />
              <div>
                <p className="text-gray-900 font-medium">Show Grid</p>
                <p className="text-xs text-gray-500">Display grid lines</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.showGrid}
                onChange={(e) => handleToggle('showGrid', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <Zap className="text-gray-500" />
              <div>
                <p className="text-gray-900 font-medium">Animations</p>
                <p className="text-xs text-gray-500">Enable chart animations</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.animation}
                onChange={(e) => handleToggle('animation', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Palette size={20} />
          Color Scheme
        </h3>



        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-12 h-12 cursor-pointer rounded-lg border border-gray-300 p-1"
              />
              <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                {config.primaryColor}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-12 h-12 cursor-pointer rounded-lg border border-gray-300 p-1"
              />
              <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                {config.backgroundColor}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Type size={20} />
          Text Settings
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Preview</p>
          <div
            className="p-4 rounded-lg text-center"
            style={{
              backgroundColor: config.backgroundColor,
              color: config.textColor,
              border: `2px solid ${config.primaryColor}20`
            }}
          >
            <p className="text-lg font-bold">{config.title}</p>
            <p className="text-sm opacity-80">Fortnite Chart Visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartControls;