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
import { TrafficVisualizationComponentProps } from "../types";
import { createNodes, createEdges } from "./GraphUtilities";
import {
  MilestoneNode,
  MilestoneStepNode,
  SystemContainer,
  SystemNode,
  DeviationContainer,
  DeviationNode,
} from "./NodeComponents";

const TrafficVisualization: React.FC<TrafficVisualizationComponentProps> = ({
  traffic_graph,
}) => {
  const { rfNodes, rfEdges } = useMemo(() => {
    const nodes = createNodes(traffic_graph.nodes);
    const edges = createEdges(traffic_graph.edges);
    return { rfNodes: nodes, rfEdges: edges };
  }, [traffic_graph]);

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
