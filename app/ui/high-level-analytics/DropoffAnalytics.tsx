import React from 'react';
import { DropoffPoint, AggregateStatistics } from '../types';

interface DropoffProps {
  dropoff_points: Record<string, DropoffPoint>;
}

const DropoffAnalytics: React.FC<DropoffProps> = ({ dropoff_points }) => {

  return (
    <div>
      {/* TODO Analytics dashboard */}
    </div>
  );
};

export default DropoffAnalytics;
