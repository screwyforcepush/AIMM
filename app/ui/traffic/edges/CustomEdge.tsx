import React, {useContext, useEffect, useState} from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from 'reactflow';



export default function CustomEdge({
    id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [selected, setSelected] = useState(false);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <>
      <g onMouseEnter={() => setTooltipVisible(true)} onMouseLeave={() => setTooltipVisible(false)}>
        <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{...style, stroke: tooltipVisible?'white':style.stroke}} />
      </g>
      {tooltipVisible && (
        <EdgeLabelRenderer>
        <div
            style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#333',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.15)',
            zIndex: 100,
            }}
            className="nodrag nopan"
        >
            {data.edgeData.trafficVolume}
        </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};