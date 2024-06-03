import React from 'react';
import { Node, Edge } from './types';
import ReactFlow, { Background, MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

interface TrafficVisualizationProps {
  nodes: Node[];
  edges: Edge[];
}

const TrafficVisualization: React.FC<TrafficVisualizationProps> = ({ nodes, edges }) => {
  const nodeElements = nodes.map(node => ({
    id: node.id,
    data: { label: `${node.label} (Tokens: ${node.totalTokens}, Avg: ${node.averageTokens})` },
    position: { x: Math.random() * window.innerWidth * 0.8, y: Math.random() * window.innerHeight * 0.8 },
  }));

  const edgeElements = edges.map(edge => ({
    id: `e${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    animated: true,
    label: `Traffic: ${edge.trafficVolume}`,
  }));

  return (
    <div style={{ height: 800 }}>
      <ReactFlow
        elements={[...nodeElements, ...edgeElements]}
        nodesConnectable={false}
        nodesDraggable={true}
        zoomOnScroll={false}
      >
        <Background color="#aaa" gap={16} />
        <MiniMap
          nodeColor={node => {
            if (node.type === 'input') return 'blue';
            return '#FFCC00';
          }}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TrafficVisualization;
