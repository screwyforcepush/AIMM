import React from 'react';
import { HighLevelAnalyticsComponentProps } from './types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Treemap } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const HighLevelAnalytics: React.FC<HighLevelAnalyticsComponentProps> = ({ totalStatistics, aggregateStatistics }) => {
  const totalData = [
    { name: 'Thread Count', value: totalStatistics.thread_count },
    { name: 'Message Count', value: totalStatistics.message_count },
    { name: 'Engagement Duration', value: totalStatistics.engagement_duration },
    { name: 'Tokens', value: totalStatistics.tokens },
    { name: 'Highest Thread Tokens', value: totalStatistics.highest_thread_tokens },
    { name: 'Leads', value: totalStatistics.leads }
  ];

  const aggregateData = [
    { name: 'Average Message Count', value: aggregateStatistics.message_count },
    { name: 'Average Engagement Duration', value: aggregateStatistics.engagement_duration },
    { name: 'Average Tokens', value: aggregateStatistics.tokens },
    { name: 'Cognitive Load', value: aggregateStatistics.cognitive_load },
    { name: 'Sentiment', value: aggregateStatistics.sentiment },
    { name: 'Engagement', value: aggregateStatistics.engagement }
  ];

  const dropoffData = Object.entries(aggregateStatistics.dropoff_point).map(([key, value]) => ({
    name: key,
    children: Object.entries(value.steps).map(([stepKey, stepValue]) => ({
      name: stepKey,
      size: stepValue,
    })),
  }));

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={totalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        {aggregateData.map((entry, index) => (
          <div key={`cell-${index}`} style={{ width: '20%', textAlign: 'center' }}>
            <h4>{entry.name}</h4>
            <p>{entry.value}</p>
          </div>
        ))}
      </div>
      <h2>Dropoff Point Analysis</h2>
      <ResponsiveContainer width="100%" height={400}>
        <Treemap data={dropoffData} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#8884d8" />
      </ResponsiveContainer>
    </div>
  );
};

export default HighLevelAnalytics;
