import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { TrafficVisualizationComponentProps, Node, Edge } from "../types";

const nodeTypes = {
  system: ({ data }: { data: Node }) => (
    <div
      style={{
        backgroundColor: "#FFD700",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  deviation: ({ data }: { data: Node }) => (
    <div
      style={{
        backgroundColor: "#FF6347",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  default: ({ data }: { data: Node }) => (
    <div
      style={{
        backgroundColor: "#90EE90",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "LR"
) => {
  // Custom layout logic here
  return { nodes, edges };
};

const TrafficVisualization: React.FC<TrafficVisualizationComponentProps> = ({
  traffic_graph,
  searchQuery,
}) => {
  const { nodes, edges } = useMemo(() => {
    const layouted = getLayoutedElements(
      traffic_graph.nodes,
      traffic_graph.edges
    );
    return {
      nodes: layouted.nodes.map((node) => ({
        ...node,
        type: nodeTypes[node.type as keyof typeof nodeTypes]
          ? node.type
          : "default",
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
