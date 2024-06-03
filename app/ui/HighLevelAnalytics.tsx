import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { HighLevelAnalyticsComponentProps } from './types';

const HighLevelAnalytics: React.FC<HighLevelAnalyticsComponentProps> = ({ totalStatistics, aggregateStatistics }) => {
  // Data for bar chart (Total Statistics)
  const totalStatsData = {
    labels: ['Thread Count', 'Engagement Duration', 'Message Count', 'Total Tokens', 'Highest Thread Tokens', 'Leads'],
    datasets: [{
      label: 'Total Statistics',
      data: [totalStatistics.thread_count, totalStatistics.engagement_duration, totalStatistics.message_count, totalStatistics.tokens, totalStatistics.highest_thread_tokens, totalStatistics.leads],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Data for pie chart (Aggregate Statistics - Sentiment)
  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      label: 'Sentiment Distribution',
      data: [aggregateStatistics.sentiment.Positive, aggregateStatistics.sentiment.Neutral, aggregateStatistics.sentiment.Negative],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Data for line chart (Aggregate Statistics - Engagement Duration)
  const engagementDurationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Engagement Duration Over Time',
      data: [/* Data points for each month */],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return (
    <div>
      <h2>High-Level Analytics</h2>
      <div>
        <Bar data={totalStatsData} />
      </div>
      <div>
        <Pie data={sentimentData} />
      </div>
      <div>
        <Line data={engagementDurationData} />
      </div>
    </div>
  );
};

export default HighLevelAnalytics;
