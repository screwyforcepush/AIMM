import React, { useEffect, useState } from 'react';
import { DropoffPoint } from '../types';
import { Treemap, ResponsiveContainer } from 'recharts';

interface DropoffProps {
  dropoff_points: Record<string, DropoffPoint>;
}

interface TreeNode {
  name: string;
  size: number;
  children?: TreeNode[];
}

const DropoffAnalytics: React.FC<DropoffProps> = ({ dropoff_points }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    const data = Object.entries(dropoff_points).map(([segment, { total_count, steps }]) => ({
      name: segment,
      size: total_count,
      children: Object.entries(steps).map(([step, count]) => ({
        name: step,
        size: count,
      })),
    }));
    setTreeData(data);
  }, [dropoff_points]);

  return (
    <div className="w-full">
      {/* TODO impliment recharts treemap */}
    </div>
  );
};

export default DropoffAnalytics;
