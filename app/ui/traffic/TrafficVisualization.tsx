import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  Handle,
  Position,
  BaseEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { TrafficVisualizationComponentProps, Node, Edge } from "../types";

// Define custom node type to include grouped children
const MilestoneNode: React.FC<{
  data: { label: string; children: Node[] };
}> = ({ data }) => {
  return (
    <div
      className="bg-green-700 bg-opacity-30 border border-black p-2 rounded"
      style={{ height: 70 * data.children.length + 50 }}
    >
      <div className="overflow-hidden">{data.label}</div>
    </div>
  );
};

const MilestoneStepNode: React.FC<{ data: { label: string } }> = ({ data }) => {
  return (
    <div
      className="overflow-hidden bg-green-700 bg-opacity-50 p-2 rounded h-40"
      style={{ height: 40 }}
    >
      <div className="">{data.label}</div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-green-700 !border-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-700 !border-none"
      />
    </div>
  );
};

const SystemContainer: React.FC<{
  data: { label: string; children: Node[] };
}> = ({ data }) => {
  return (
    <div
      className="bg-gray-400 border border-black p-2 rounded"
      style={{ height: 100 }}
    >
      <div className="">System</div>
    </div>
  );
};

const SystemNode: React.FC<{ data: { label: string } }> = ({ data }) => {
  return (
    <div
      className="overflow-hidden bg-gray-600 p-2 rounded h-40"
      style={{ height: 40 }}
    >
      <div className="text-white text-center font-semibold">{data.label}</div>

      <Handle
        type={data.label === "Exit" ? "target" : "source"}
        position={Position.Bottom}
        className="!bg-gray-900 !border-none"
      />
    </div>
  );
};

const DeviationContainer: React.FC<{
  data: { label: string; children: Node[] };
}> = ({ data }) => {
  return (
    <div
      className="bg-yellow-300 bg-opacity-30 border border-black p-2 rounded"
      style={{ height: 100 }}
    >
      <div className="">Deviation</div>
    </div>
  );
};

const DeviationNode: React.FC<{ data: { label: string } }> = ({ data }) => {
  return (
    <div
      className={`overflow-hidden p-2 rounded h-40 ${
        data.label === "Prompt Hack Attempt"
          ? "bg-red-500"
          : data.label === "User Tangent"
          ? "bg-gray-400"
          : "bg-orange-500"
      }`}
      style={{ height: 40 }}
    >
      <div className="">{data.label}</div>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-500 !border-none"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-500 !border-none"
      />{" "}
    </div>
  );
};

const TrafficVisualization: React.FC<TrafficVisualizationComponentProps> = ({
  traffic_graph,
}) => {
  // Group nodes by type
  const groupedNodes: { [key: string]: Node[] } = {};
  traffic_graph.nodes.forEach((node) => {
    if (!groupedNodes[node.type]) {
      groupedNodes[node.type] = [];
    }
    groupedNodes[node.type].push(node);
  });

  // Create reactflow nodes
  const rfNodes = useMemo(() => {
    const nodes: any[] = [];
    let indexOffset = 0;
    Object.keys(groupedNodes).forEach((type, index) => {
      const children = groupedNodes[type];
      let nType = "milestone";
      let nPosition = { x: (index - indexOffset) * 250, y: 300 };
      let width = 220;
      let fullwidth = Math.max(
        Object.keys(groupedNodes).length - 2,
        children.length
      );
      if (type === "system") {
        nType = "system";
        nPosition = { x: 0, y: 0 };
        indexOffset++;
        width = 250 * fullwidth - 30;
      } else if (type === "deviation") {
        nType = "deviation";
        nPosition = { x: 0, y: 150 };
        indexOffset++;
        width = 250 * fullwidth - 30;
      }

      nodes.push({
        id: type,
        data: { label: type, children },
        position: nPosition,
        style: { width: width },
        type: nType,
      });

      children.forEach((child, childIndex) => {
        if (type === "system") {
          nType = "systemStep";
          nPosition = { x: childIndex * (fullwidth - 1) * 250 + 10, y: 50 };
        } else if (type === "deviation") {
          nType = "deviationStep";
          let middleNodeStart =
            (fullwidth * 250) / 2 - (250 * children.length) / 2;

          nPosition = {
            x: childIndex * 250 + middleNodeStart + 10,
            y: 50,
          };
        } else {
          nType = "milestoneStep";
          nPosition = { x: 10, y: childIndex * 70 + 50 };
        }
        nodes.push({
          id: child.id,
          data: { label: child.label },
          position: nPosition,
          parentId: type,
          extent: "parent",
          type: nType,
          className: nType,
          style: { width: 200 },
        });
      });
    });
    return nodes;
  }, [traffic_graph.nodes]);

  // Create reactflow edges
  const rfEdges = useMemo(() => {
    // Find the maximum trafficVolume
    const maxTrafficVolume = Math.max(
      ...traffic_graph.edges.map((edge) => edge.trafficVolume)
    );

    return traffic_graph.edges.map((edge: Edge) => {
      // Calculate the stroke width and color based on the trafficVolume
      const strokeWidth = 1 + 2 * (edge.trafficVolume / maxTrafficVolume);
      const grayScale = Math.floor(
        255 - 220 * (edge.trafficVolume / maxTrafficVolume)
      ).toString(16);

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
    <div className="w-full" style={{ height: "calc(100vh - 150px)" }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={{
          milestone: MilestoneNode,
          milestoneStep: MilestoneStepNode,
          system: SystemContainer,
          systemStep: SystemNode,
          deviation: DeviationContainer,
          deviationStep: DeviationNode,
        }}
        fitView
        defaultEdgeOptions={{ type: "bezier", zIndex: 10 }}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default TrafficVisualization;
