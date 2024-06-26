import React from 'react';
import { TotalStatistics } from '../types';

interface TotalAnalyticsProps {
  totalStatistics: TotalStatistics;
}

const TotalAnalytics: React.FC<TotalAnalyticsProps> = ({ totalStatistics }) => {
const metrics = [
  { name: 'Thread Count', value: totalStatistics.thread_count, icon: '🧵' },
  { name: 'Message Count', value: totalStatistics.message_count, icon: '💬' },
  { name: 'Engagement Duration', value: Math.round(totalStatistics.engagement_duration / 60), suffix: ' mins', icon: '⏳', bar: 500 },
  { name: 'Cost', value: Number((totalStatistics.tokens / 80000).toFixed(2)), prefix: '$', icon: '💰', bar: 30 },
  { name: 'Highest Thread Cost', value: Number((totalStatistics.highest_thread_tokens / 80000).toFixed(2)), prefix: '$', icon: '🏆' },
  { name: 'Leads', value: totalStatistics.leads, icon: '👥' }
];
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Total:</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex flex-col items-center p-4 border rounded-lg shadow">
            <div className="text-lg font-semibold">{metric.icon} {metric.name}</div>
              <div className="text-2xl font-bold my-2">{metric.prefix}{metric.value}{metric.suffix}</div>
              {metric.bar && <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (metric.value / metric.bar) * 100)}%` }}></div>
            </div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalAnalytics;
