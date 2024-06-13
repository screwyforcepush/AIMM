import React, { useMemo } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { TrafficVisualizationComponentProps, Node, Edge } from "../types";
import { MilestoneNode, MilestoneStepNode, SystemContainer, SystemNode, DeviationContainer, DeviationNode } from './nodes/CustomNodes';


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
          data: { label: child.label, nodeData: child },
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
        className: "custom-edge",
        data: { edgeData: edge }
      };
    });
  }, [traffic_graph.edges]);

  const onEdgeClick = (edge: any) => console.log('click edge', edge);
  const onNodeClick = (node: any) => {
    console.log('click node', node);
    // node.data.hover=true;
  };


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
        defaultEdgeOptions={{ zIndex: 10 }}
        nodesConnectable={false}
        elementsSelectable={true}
        nodesFocusable={true}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
      >
      </ReactFlow>
    </div>
  );
};

export default TrafficVisualization;
