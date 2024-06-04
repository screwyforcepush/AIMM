import React, {useState} from 'react';
import TotalAnalytics from './TotalAnalytics'; 
import AggregateAnalytics from './AggregateAnalytics';
import DropoffAnalytics from './DropoffAnalytics';
import { HighLevelAnalyticsComponentProps } from '../types';

const HighLevelAnalytics: React.FC<HighLevelAnalyticsComponentProps> = ({ totalStatistics, aggregateStatistics }) => {
  const [activeTab, setActiveTab] = useState('Total');

  return (
    <div className="p-4">
      <div className="flex gap-2 border-b border-gray-200">
        {['Total', 'Aggregate', 'Dropoff'].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-white transition duration-150 ease-in-out rounded-t
                        ${activeTab === tab ? 'bg-cyan-600' : 'bg-blue-700 hover:bg-blue-800'}
                        ${activeTab === tab ? 'border-b-2 border-cyan-600' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {`${tab}`}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeTab === 'Total' && <TotalAnalytics totalStatistics={totalStatistics} />}
        {activeTab === 'Aggregate' && <AggregateAnalytics aggregateStatistics={aggregateStatistics} />}
        {activeTab === 'Dropoff' && <DropoffAnalytics dropoff_points={aggregateStatistics.dropoff_point} />}
      </div>
    </div>
  );
};

export default HighLevelAnalytics;
