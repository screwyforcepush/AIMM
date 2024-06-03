'use client';
import React, { useState, useEffect } from 'react';
import HighLevelAnalytics from './HighLevelAnalytics';
import TrafficVisualization from './TrafficVisualization';
import SearchFeature from './SearchFeature';
import assistantsData from './assistants-data-example.json';

const DataViz = () => {
  const [view, setView] = useState<'high-level' | 'traffic'>('high-level');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
      <SearchFeature onSearch={handleSearch} />
      {view === 'high-level' ? <HighLevelAnalytics data={assistantsData} /> : <TrafficVisualization data={assistantsData} searchQuery={searchQuery} />}
    </div>
  );
};

export default DataViz;
