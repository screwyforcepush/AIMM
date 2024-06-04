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

  // Define a color scale function
  const colorScale = (size: number, max: number) => {
    const hue = (size / max) * 120; // from green to red
    return `hsl(${hue}, 100%, 50%)`;
  };

  // Find the maximum size for the color scale
  const maxSize = Math.max(...treeData.map(node => node.size));

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer>
        <Treemap
          data={treeData}
          dataKey="size"
          ratio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
          content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => (
            <g>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                  fill: colorScale(payload.size, maxSize),
                  stroke: '#fff',
                  strokeWidth: 2 / (depth + 1e-10),
                  strokeOpacity: 1 / (depth + 1e-10),
                }}
              />
              {depth === 1 ? (
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 7}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={14}
                >
                  {name} ({payload.size})
                </text>
              ) : null}
            </g>
          )}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default DropoffAnalytics;
