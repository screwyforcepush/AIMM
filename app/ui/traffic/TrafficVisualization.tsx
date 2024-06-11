import React, { useMemo } from 'react';
import ReactFlow, { Background, MiniMap, Controls, Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import { TrafficVisualizationComponentProps } from '../types';

const nodeTypes = {
  system: ({ data }) => (
    <div style={{ backgroundColor: '#FFD700', padding: '10px', borderRadius: '5px' }}>
      <Handle type="target" position="left" />
      <div>{data.label}</div>
      <Handle type="source" position="right" />
    </div>
  ),
  deviation: ({ data }) => (
    <div style={{ backgroundColor: '#FF6347', padding: '10px', borderRadius: '5px' }}>
      <Handle type="target" position="left" />
      <div>{data.label}</div>
      <Handle type="source" position="right" />
    </div>
  ),
  default: ({ data }) => (
    <div style={{ backgroundColor: '#90EE90', padding: '10px', borderRadius: '5px' }}>
      <Handle type="target" position="left" />
      <div>{data.label}</div>
      <Handle type="source" position="right" />
    </div>
  ),
};

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  // Custom layout logic here
  return { nodes, edges };
};

const TrafficVisualization: React.FC<TrafficVisualizationComponentProps> = ({ traffic_graph, searchQuery }) => {
  const { nodes, edges } = useMemo(() => {
    const layouted = getLayoutedElements(traffic_graph.nodes, traffic_graph.edges);
    return {
      nodes: layouted.nodes.map((node) => ({
        ...node,
        type: nodeTypes[node.type] ? node.type : 'default',
        data: { label: node.label },
      })),
      edges: layouted.edges.map((edge) => ({
        ...edge,
        style: { stroke: `rgba(0, 0, 0, ${edge.trafficVolume / 10})` },
      })),
    };
  }, [traffic_graph]);

  return (
    <div style={{ height: 500 }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TrafficVisualization;
