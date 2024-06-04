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
      {treeData.map((segment, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="font-bold text-lg">{segment.name}</div>
          <div className="flex flex-wrap">
            {segment.children && segment.children.map((step, stepIndex) => (
              <div key={stepIndex} className={`p-2 m-1 bg-blue-500 text-white rounded-lg text-sm flex-1`} style={{ flexBasis: `${step.size}%` }}>
                {step.name} - {step.size}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DropoffAnalytics;
