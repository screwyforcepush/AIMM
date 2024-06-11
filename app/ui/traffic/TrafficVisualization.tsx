import React from 'react';
import { Node, Edge } from '../types';
import ReactFlow, { Background, MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { TrafficVisualizationComponentProps } from '../types';


const TrafficVisualization: React.FC<TrafficVisualizationComponentProps> = ({traffic_graph, searchQuery }) => {


return (
  <div>
    <pre>{JSON.stringify(traffic_graph, null, 2)}</pre>
  </div>
);
};

export default TrafficVisualization;
