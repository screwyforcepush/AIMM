import React from 'react';
import { Node, Edge } from './types';
import ReactFlow, { Background, MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { TrafficVisualizationComponentProps } from './types';


const TrafficVisualization: React.FC<TrafficVisualizationComponentProps> = ({traffic_graph, searchQuery }) => {

  //TODO placeholder just get the first graph
  const graph = traffic_graph[0];


  // const nodeElements = graph.nodes.map(node => ({
  //   id: node.id,
  //   data: { label: `${node.label} (Tokens: ${node.tokens}, Avg: ${node.averageTokens})` },
  //   position: { x: Math.random() * window.innerWidth * 0.8, y: Math.random() * window.innerHeight * 0.8 },
  // }));

  // const edgeElements = graph.edges.map(edge => ({
  //   id: `e${edge.source}-${edge.target}`,
  //   source: edge.source,
  //   target: edge.target,
  //   animated: true,
  //   label: `Traffic: ${edge.trafficVolume}`,
  // }));

  return (
    <div style={{ height: 800 }}>
      {/* <ReactFlow
        nodes={nodeElements}
        edges={edgeElements}
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
      </ReactFlow> */}
      TODO
    </div>
  );
};

export default TrafficVisualization;
