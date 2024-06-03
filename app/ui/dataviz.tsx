'use client';
import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { AssistantData, TotalStatistics, AggregateStatistics, HighLevelAnalytics, TrafficVisualization } from './types';
import assistantsData from './assistants-data-example.json';

const DataViz = () => {
  const [data, setData] = useState<AssistantData>(assistantsData);
  const [totalStats, setTotalStats] = useState<TotalStatistics>(data.total);
  const [aggregateStats, setAggregateStats] = useState<AggregateStatistics>(data.aggregate);
  const [view, setView] = useState<'high-level' | 'traffic'>('high-level');

  useEffect(() => {
    // This is where we would fetch real-time data in future updates
  }, []);

  const renderHighLevelAnalytics = () => {
    const totalStatsOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Total Statistics',
        },
      },
    };

    const aggregateStatsOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Aggregate Statistics',
        },
      },
    };

    const totalStatsData = {
      labels: Object.keys(totalStats),
      datasets: [
        {
          label: 'Total Statistics',
          data: Object.values(totalStats),
          backgroundColor: Object.keys(totalStats).map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`),
        },
      ],
    };

    const aggregateStatsData = {
      labels: Object.keys(aggregateStats).filter(key => key !== 'dropoff_point'),
      datasets: [
        {
          label: 'Aggregate Statistics',
          data: Object.values(aggregateStats).filter(value => typeof value !== 'object'),
          backgroundColor: Object.keys(aggregateStats).map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`),
        },
      ],
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Total Statistics</h2>
          <Bar options={totalStatsOptions} data={totalStatsData} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Aggregate Statistics</h2>
          <Pie options={aggregateStatsOptions} data={aggregateStatsData} />
        </div>
      </div>
    );
  };

  const renderTrafficVisualization = () => {
    // Placeholder for traffic visualization component
    return <div>Traffic Visualization Placeholder</div>;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Data Visualization Dashboard</h1>
      <div className="mb-4">
        <button onClick={() => setView('high-level')} className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          High-Level Analytics
        </button>
        <button onClick={() => setView('traffic')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Traffic Visualization
        </button>
      </div>
      {view === 'high-level' ? renderHighLevelAnalytics() : renderTrafficVisualization()}
    </div>
  );
};

export default DataViz;
