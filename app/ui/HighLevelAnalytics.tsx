import React from 'react';
import TotalAnalytics from './TotalAnalytics'; // Importing the TotalAnalytics component
import { HighLevelAnalyticsComponentProps } from './types';

const HighLevelAnalytics: React.FC<HighLevelAnalyticsComponentProps> = ({ totalStatistics, aggregateStatistics }) => {
  return (
    <div>
      <TotalAnalytics totalStatistics={totalStatistics} />
      {/* Other components for aggregate and dropoff point analytics will be added here */}
    </div>
  );
};

export default HighLevelAnalytics;
