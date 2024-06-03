import React from 'react';
import { Bar, Pie, Line, Funnel } from 'react-chartjs-2';
import 'chart.js/auto';
import { HighLevelAnalyticsComponentProps } from './types';

const HighLevelAnalytics: React.FC<HighLevelAnalyticsComponentProps> = ({ totalStatistics, aggregateStatistics }) => {
  // Data for line chart (Thread Count over time with trend line)
  const threadCountData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Thread Count',
      data: [/* Data points for each month */],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  // Data for gauge chart (Engagement Duration)
  const engagementDurationData = {
    datasets: [{
      data: [aggregateStatistics.engagement_duration, 100 - aggregateStatistics.engagement_duration], // Assuming 100 is the target or max value
      backgroundColor: ['rgb(75, 192, 192)', 'rgb(231,233,237)'],
    }]
  };

  // Data for conversion funnel (Leads)
  const leadsData = {
    labels: ['Total Engagements', 'Qualified Leads'],
    datasets: [{
      data: [totalStatistics.thread_count, totalStatistics.leads],
      backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
      borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1
    }]
  };

  // Data for color-coded indicators (Cognitive Load & Sentiment)
  // Assuming a simple implementation where color is determined by the value
  const cognitiveLoadColor = aggregateStatistics.cognitive_load === 'High' ? 'red' : aggregateStatistics.cognitive_load === 'Medium' ? 'yellow' : 'green';
  const sentimentColor = aggregateStatistics.sentiment === 'Negative' ? 'red' : aggregateStatistics.sentiment === 'Neutral' ? 'yellow' : 'green';

  // Data for icon-based indicators (Engagement)
  // Assuming a simple implementation where icon is determined by the value
  const engagementIcon = aggregateStatistics.engagement === 'Engaged' ? '👍' : aggregateStatistics.engagement === 'Partially Engaged' ? '👌' : '👎';

  return (
    <div>
      <h2>High-Level Analytics</h2>
      <div>
        <Line data={threadCountData} />
      </div>
      <div>
        <Pie data={engagementDurationData} />
      </div>
      <div>
        <Funnel data={leadsData} />
      </div>
      <div>
        Cognitive Load: <span style={{ color: cognitiveLoadColor }}>{aggregateStatistics.cognitive_load}</span>
      </div>
      <div>
        Sentiment: <span style={{ color: sentimentColor }}>{aggregateStatistics.sentiment}</span>
      </div>
      <div>
        Engagement: <span>{engagementIcon}</span>
      </div>
    </div>
  );
};

export default HighLevelAnalytics;
