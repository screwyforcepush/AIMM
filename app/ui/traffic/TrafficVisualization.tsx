import React, { useMemo, useState, useEffect } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { TrafficVisualizationComponentProps, Node, Edge } from "../types";
import {
  MilestoneNode,
  MilestoneStepNode,
  SystemContainer,
  SystemNode,
  DeviationContainer,
  DeviationNode,
} from "./nodes/CustomNodes";
import CustomEdge from "./edges/CustomEdge";
import DevTools from "./tools/Devtools";

const TrafficVisualization: React.FC<TrafficVisualizationComponentProps> = ({
  traffic_graph,
  threads,
}) => {
  // Create reactflow nodes
  const rfNodes = useMemo(() => {
    // Group nodes by type
    const groupedNodes: { [key: string]: Node[] } = {};
    traffic_graph.nodes.forEach((node) => {
      if (!groupedNodes[node.type]) {
        groupedNodes[node.type] = [];
      }
      groupedNodes[node.type].push(node);
    });
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

  // Add a new state variable for the selected edge
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filterThreadId, setFilterThreadId] = useState<string | null>(null);



  // Create reactflow edges
  const rfEdges = useMemo(() => {
    // Calculate the stroke width and color based on the trafficVolume
    function normalize(value: number, min: number, max: number): number {
      return (value - min) / (max - min);
    }

    function scaleStrokeWidth(
      trafficVolume: number,
      maxTrafficVolume: number
    ): number {
      const normalizedVolume = normalize(trafficVolume, 1, maxTrafficVolume);
      return 1 + 2 * Math.log(1 + normalizedVolume * 9); // Logarithmic scaling
    }

    function scaleStrokeColor(
      trafficVolume: number,
      maxTrafficVolume: number
    ): string {
      // Normalize the traffic volume within the range of 1 to maxTrafficVolume
      const normalizedVolume = normalize(trafficVolume, 1, maxTrafficVolume);

      // Apply a logarithmic scale to enhance the contrast in the lower range
      const logScale = Math.log10(1 + normalizedVolume * 9);

      // Adjust the color scaling to range from mid-grey to very dark grey
      const scaledValue = Math.floor(127 - 112 * logScale)
        .toString(16)
        .padStart(2, "0");

      // Return the resulting color in hex format
      return `#${scaledValue}${scaledValue}${scaledValue}`;
    }
    // Find the maximum trafficVolume
    const maxTrafficVolume = Math.max(
      ...traffic_graph.edges.map((edge) => edge.trafficVolume)
    );

    return traffic_graph.edges.map((edge: Edge) => {
      // Calculate the stroke width and color based on the trafficVolume
      // const strokeWidth = 1 + 2 * (edge.trafficVolume / maxTrafficVolume);
      // const grayScale = Math.floor(
      //   255 - 220 * (edge.trafficVolume / maxTrafficVolume)
      // ).toString(16);

      // const strokeColor = `#${grayScale}${grayScale}${grayScale}`;
      const strokeWidth: number = scaleStrokeWidth(
        edge.trafficVolume,
        maxTrafficVolume
      );
      const strokeColor: string = scaleStrokeColor(
        edge.trafficVolume,
        maxTrafficVolume
      );

      // should refactor this hardcoded two places
      const edgeId = `${edge.source}-${edge.target}`;

      return {
        id: edgeId,
        source: edge.source,
        target: edge.target,
        style: {
          strokeWidth: strokeWidth.toString(),
          stroke: strokeColor,
        },
        animated: true,
        type: "customedge",
        data: { edgeData: edge },
      };
    });
  }, [traffic_graph.edges]);

  const onEdgeClick = (event: any, edge: any) => {
    console.log("click edge", edge);
    setSelectedEdge(edge.data.edgeData);
    setSelectedNode(null);
  };
  const [filteredRFEdges, setFilteredRFEdges] = useState(rfEdges);

  const onNodeClick = (event: any, node: any) => {
    console.log("click node", node);
    setSelectedNode(node.data.nodeData);
    setSelectedEdge(null);
  };


  useEffect(() => {
    if (filterThreadId) {
      const filteredEdges = rfEdges.filter((edge) =>
        edge.data.edgeData.thread_ids.includes(filterThreadId)
      );
      setFilteredRFEdges(filteredEdges);
    } else {
      setFilteredRFEdges(rfEdges);
    }
  }, [filterThreadId, rfEdges]);

  useEffect(() => {
    if (selectedNode) {
      setFilteredRFEdges(rfEdges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id));
    } else if (selectedEdge) {
      setFilteredRFEdges(rfEdges.filter((edge) =>
        edge.id == `${selectedEdge.source}-${selectedEdge.target}`
      ))
    } else {
      setFilteredRFEdges(rfEdges);
    }
  }, [selectedNode, rfEdges, selectedEdge]);


  return (
    <div className="w-full" style={{ height: "calc(100vh - 150px)" }}>
      <ReactFlow
        nodes={rfNodes}
        edges={filteredRFEdges}
        nodeTypes={{
          milestone: MilestoneNode,
          milestoneStep: MilestoneStepNode,
          system: SystemContainer,
          systemStep: SystemNode,
          deviation: DeviationContainer,
          deviationStep: DeviationNode,
        }}
        edgeTypes={{
          customedge: CustomEdge,
        }}
        fitView
        defaultEdgeOptions={{ zIndex: 10 }}
        nodesConnectable={false}
        // elementsSelectable={true}
        // edgesFocusable={true}
        // nodesFocusable={true}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
      >
        <DevTools
          edge={selectedEdge}
          node={selectedNode}
          nodeMessages={traffic_graph.nodeMessages}
          threads={threads}
          setFilterThreadId={setFilterThreadId}
          setSelectedNode={setSelectedNode}
          setSelectedEdge={setSelectedEdge}
        />
      </ReactFlow>
    </div>
  );
};

export default TrafficVisualization;
