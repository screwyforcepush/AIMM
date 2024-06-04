import React from 'react';
import { AggregateStatistics } from '../types';

interface AggregateAnalyticsProps {
  aggregateStatistics: AggregateStatistics;
}

const AggregateAnalytics: React.FC<AggregateAnalyticsProps> = ({ aggregateStatistics }) => {
  const metrics = [
    { name: 'Message Count', value: Math.round(aggregateStatistics.message_count), icon: '💬' },
    { name: 'Engagement Duration', value: Math.round(aggregateStatistics.engagement_duration / 60), suffix: ' mins', icon: '⏳', bar: 5 },
    { name: 'Engagement Cost', value: Number((aggregateStatistics.tokens / 80000).toFixed(2)), prefix: '$', icon: '💰', bar: 1 },
    { name: 'Cognitive Load', value: aggregateStatistics.cognitive_load, icon: '🧠' },
    { name: 'Sentiment', value: aggregateStatistics.sentiment, icon: '😐' },
    { name: 'Engagement', value: aggregateStatistics.engagement, icon: '🔥' },
// TODO rest of metrics
  ];
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Average:</h2>
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

export default AggregateAnalytics;
