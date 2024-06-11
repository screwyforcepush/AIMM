import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
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
        border: "2px solid black",
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
        border: "2px solid black",
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
        border: "2px solid black",
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
  // Group nodes by their type
  const groupedNodes = nodes.reduce((acc, node) => {
    acc[node.type] = acc[node.type] || [];
    acc[node.type].push(node);
    return acc;
  }, {});

  // Position nodes of the same type closer together
  let yPos = 0;
  let xPos = 0;
  const layoutedNodes = [];
  Object.keys(groupedNodes).forEach((type, typeIndex) => {
    groupedNodes[type].forEach((node, index) => {
      layoutedNodes.push({
        ...node,
        position: { x: xPos, y: yPos },
      });
      yPos += 100; // Increment y position for the next node in the same group
    });
    xPos += 250; // Increment x position for the next group
    yPos = 0; // Reset y position for the next group
  });

  return { nodes: layoutedNodes, edges };
};

const TrafficVisualization: React.FC<TrafficVisualizationComponentProps> = ({
  traffic_graph,
  searchQuery,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useMemo(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      traffic_graph.nodes,
      traffic_graph.edges
    );
    setNodes(
      layoutedNodes.map((node) => ({
        ...node,
        type: nodeTypes[node.type as keyof typeof nodeTypes]
          ? node.type
          : "default",
        data: { label: node.label },
      }))
    );
    setEdges(
      layoutedEdges.map((edge, index) => ({
        ...edge,
        id: `edge-${index}`,
        style: { strokeWidth: `${Math.max(1, edge.trafficVolume / 10)}px` },
      }))
    );
  }, [traffic_graph, setNodes, setEdges]);

  return (
    <div style={{ height: 500 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TrafficVisualization;
