'use client';
import React, { useState, useEffect } from 'react';
import HighLevelAnalytics from './high-level-analytics/HighLevelAnalytics';
import TrafficVisualization from './traffic/TrafficVisualization';
import FlowGuardRoadmap from './roadmap/FlowGuardRoadmap';
import SearchFeature from './SearchFeature';
import data from './threads_data.json';
import {parseAssistantData, AggregateStatistics} from './types'
import {buildTrafficGraph} from './traffic/TrafficGraph'
// Ensure data has the correct structure
const assitant_data = parseAssistantData(data);
const traffic_graph = buildTrafficGraph(assitant_data.threads)

const DataViz = () => {
  const [view, setView] = useState<'high-level' | 'traffic' | 'roadmap'>('high-level');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="p-4 h-full">
      <h1 className="text-xl font-semibold mb-4">Data Visualization Dashboard *WIP*</h1>
      <div className="mb-4">
        <button 
          onClick={() => setView('high-level')} 
          className={`mr-2 font-bold py-2 px-4 text-white transition duration-150 ease-in-out rounded-t ${view === 'high-level' ? 'bg-cyan-600 border-b-2 border-cyan-600' : 'bg-blue-700 hover:bg-blue-800'}`}
        >
          High-Level
        </button>
        <button 
          onClick={() => setView('traffic')} 
          className={`mr-2 font-bold py-2 px-4 text-white transition duration-150 ease-in-out rounded-t ${view === 'traffic' ? 'bg-cyan-600 border-b-2 border-cyan-600' : 'bg-blue-700 hover:bg-blue-800'}`}
        >
          Traffic
        </button>
        <button 
          onClick={() => setView('roadmap')} 
          className={`font-bold py-2 px-4 text-white transition duration-150 ease-in-out rounded-t ${view === 'roadmap' ? 'bg-cyan-600 border-b-2 border-cyan-600' : 'bg-blue-700 hover:bg-blue-800'}`}
        >
          Roadmap
        </button>
      </div>
      {/* <SearchFeature onSearch={handleSearch} /> */}
      {view === 'high-level' ? 
      <HighLevelAnalytics 
        totalStatistics={assitant_data.total} 
        aggregateStatistics={assitant_data.aggregate as AggregateStatistics} 
      /> : view === 'traffic' ? 
      <TrafficVisualization  
      traffic_graph={traffic_graph} 
      searchQuery={searchQuery}
      threads={assitant_data.threads} />:
      <FlowGuardRoadmap/>}
    </div>
  );
};

export default DataViz;
