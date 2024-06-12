import React, { useMemo } from 'react';
import ReactFlow, { Background, MiniMap, Controls, Handle, Position, BaseEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import { TrafficVisualizationComponentProps, Node, Edge } from '../types';

// Define custom node type to include grouped children
const MilestoneNode: React.FC<{ data: { label: string, children: Node[] } }> = ({ data }) => {
  return (
    <div className="bg-green-900 bg-opacity-50 border border-black p-2 rounded"
    style={{ height: 70 * data.children.length+ 50 }}>
      <div className='overflow-hidden'>{data.label}</div>
    </div>
  );
};

const MilestoneStepNode: React.FC<{ data: { label: string } }> = ({ data }) => {
  return (
    <div className='overflow-hidden bg-green-700 bg-opacity-50 border border-black p-2 rounded h-40' 
    style={{ height: 40 }}>
      <div className=''>{data.label}</div>

      <Handle type="target" position={Position.Left} className="!bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-teal-500" />
   
    </div>
  );
};

// Convert trafficVolume to edge thickness
const getEdgeStyle = (trafficVolume: number) => ({
  strokeWidth: Math.max(1, trafficVolume / 10),
});


const TrafficVisualization: React.FC<TrafficVisualizationComponentProps> = ({ traffic_graph }) => {
  // Group nodes by type
  const groupedNodes: { [key: string]: Node[] } = {};
  traffic_graph.nodes.forEach(node => {
    if (!groupedNodes[node.type]) {
      groupedNodes[node.type] = [];
    }
    groupedNodes[node.type].push(node);
  });


  // Create reactflow nodes
  const rfNodes = useMemo(() => {
    const nodes: any[] = [];
    Object.keys(groupedNodes).forEach((type, index) => {
      const children = groupedNodes[type];
      nodes.push({
        id: `group-${type}`,
        data: { label: type, children},
        position: { x: index * 250, y: 0 },
        style: { width: 220 },
        type: 'milestone',
      });
      children.forEach((child, childIndex) => {
        nodes.push({
          id: child.id,
          data: { label: child.label },
          position: { x: 10, y: childIndex * 70 + 50 },
          parentId: `group-${type}`,
          extent: 'parent',
          type: 'milestoneStep',
          className: child.label,
          style: { width: 200 },
        });
      });
    });
    return nodes;
  }, [traffic_graph.nodes]);

// Create reactflow edges
const rfEdges = useMemo(() => {
  // Find the maximum trafficVolume
  const maxTrafficVolume = Math.max(...traffic_graph.edges.map(edge => edge.trafficVolume));

  return traffic_graph.edges.map((edge: Edge) => {
    // Calculate the stroke width and color based on the trafficVolume
    const strokeWidth = 1 + 2 * (edge.trafficVolume / maxTrafficVolume);
    const grayScale = Math.floor(255 - 200 * (edge.trafficVolume / maxTrafficVolume)).toString(16);

    const strokeColor = `#${grayScale}${grayScale}${grayScale}`;

    return {
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      style: { 
        strokeWidth: strokeWidth.toString(),
        stroke: strokeColor,
      },
      animated: true,
    };
  });
}, [traffic_graph.edges]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={{ milestone: MilestoneNode, milestoneStep: MilestoneStepNode}}
        fitView
        defaultEdgeOptions={{ type: 'bezier' }}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TrafficVisualization;
