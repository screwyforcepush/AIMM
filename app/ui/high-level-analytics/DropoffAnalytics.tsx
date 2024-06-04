import React, { useEffect, useState } from 'react';
import { DropoffPoint } from '../types';
import { Treemap, Tooltip } from 'recharts';

interface DropoffProps {
  dropoff_points: Record<string, DropoffPoint>;
}

const DropoffAnalytics: React.FC<DropoffProps> = ({ dropoff_points }) => {
  const [treeData, setTreeData] = useState([]);

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
    <div style={{ width: '100%', height: 400 }}>
      <Treemap
        width={800}
        height={400}
        data={treeData}
        dataKey="size"
        ratio={4/3}
        stroke="#fff"
        fill="#8884d8"
        content={<CustomizedContent colors={['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658']} />}
      >
        <Tooltip />
      </Treemap>
    </div>
  );
};

const CustomizedContent = ({ root, depth, x, y, width, height, index, colors, name, size }) => {
  const colorScale = d3.scaleLinear()
    .domain([0, Math.max(...root.children.map(d => d.size))])
    .range(["#83a6ed", "#ff6347"]); // Light blue to tomato red

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colorScale(size) : 'none',
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
          {name} - {size}
        </text>
      ) : null}
    </g>
  );
};

export default DropoffAnalytics;
