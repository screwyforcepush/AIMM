import React, { useState } from "react";
import { Handle, Position, HandleType, NodeToolbar } from "reactflow";
import { Node } from "../../types";
import NodeDetails from "../util/NodeDetails";

interface BaseNodeProps {
  data: { label: string; nodeData: Node };
  style: React.CSSProperties;
  className: string;
  handles: { type: HandleType; position: Position }[];
  textClassName?: string;
  showTooltip: boolean;
}

const BaseNode: React.FC<BaseNodeProps> = ({
  data,
  style,
  className,
  handles,
  textClassName = "",
  showTooltip,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className="relative">
      <div
        className={`overflow-hidden whitespace-nowrap p-2 rounded h-40 cursor-pointer ${className}`}
        style={style}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        <div className={`${textClassName}`}>{data.label}</div>
        {handles.map((handle, index) => (
          <Handle
            key={index}
            type={handle.type}
            position={handle.position}
            className="!bg-gray-500 !border-none"
          />
        ))}
      </div>
      <NodeToolbar
        isVisible={tooltipVisible && showTooltip}
        position={Position.Right}
      >
        <NodeDetails nodeData={data.nodeData} className="border border-gray-300 rounded shadow-lg bg-white text-gray-800 w-64"/>
      </NodeToolbar>
    </div>
  );
};
export default BaseNode;
