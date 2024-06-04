import React, { useEffect, useState } from 'react';
import { DropoffPoint } from '../types';
import { TreeMap } from 'react-d3-treemap';
import 'react-d3-treemap/dist/react.d3.treemap.css';

interface DropoffProps {
  dropoff_points: Record<string, DropoffPoint>;
}

const DropoffAnalytics: React.FC<DropoffProps> = ({ dropoff_points }) => {
  const [treeData, setTreeData] = useState({});

  useEffect(() => {
    const data = {
      name: "Dropoff Points",
      children: Object.entries(dropoff_points).map(([segment, { total_count, steps }]) => ({
        name: segment,
        value: total_count,
        children: Object.entries(steps).map(([step, count]) => ({
          name: step,
          value: count,
        })),
      })),
    };
    setTreeData(data);
  }, [dropoff_points]);

  return (
    <div>
      <TreeMap
        height={400}
        width={800}
        data={treeData}
        valueUnit={"Dropoffs"}
        valueFormat={value => `${value}`}
        onNodeClick={(node) => console.log(node)}
      />
    </div>
  );
};

export default DropoffAnalytics;
