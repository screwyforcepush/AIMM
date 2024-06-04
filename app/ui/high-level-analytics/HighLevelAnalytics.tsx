import React from 'react';
import TotalAnalytics from './TotalAnalytics'; 
import AggregateAnalytics from './AggregateAnalytics';
import DropoffAnalytics from './DropoffAnalytics';
import { HighLevelAnalyticsComponentProps } from '../types';

const HighLevelAnalytics: React.FC<HighLevelAnalyticsComponentProps> = ({ totalStatistics, aggregateStatistics }) => {
  return (
    <div>
      <TotalAnalytics totalStatistics={totalStatistics} />
      <AggregateAnalytics aggregateStatistics={aggregateStatistics} />
      <DropoffAnalytics dropoff_points={aggregateStatistics.dropoff_point} />
    </div>
  );
};

export default HighLevelAnalytics;
