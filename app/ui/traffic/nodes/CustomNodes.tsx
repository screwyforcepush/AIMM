import React from 'react';
import BaseNode from './BaseNode';
import BaseContainer from './BaseContainer';
import { Position } from 'reactflow';
import { Node } from "../../types";


export const MilestoneNode: React.FC<{ data: { label: string; children: Node[] } }> = ({ data }) => {
  return (
    <BaseContainer
      data={data}
      style={{ height: 70 * data.children.length + 50 }}
      className="bg-green-700 bg-opacity-30"
    />
  );
};

export const MilestoneStepNode: React.FC<{ data: { label: string; nodeData: Node } }> = ({ data }) => {
  return (
    <BaseNode
      data={data}
      style={{ height: 40 }}
      className="bg-green-700 bg-opacity-80"
      handles={[
        { type: 'target', position: Position.Left },
        { type: 'source', position: Position.Bottom }
      ]}
      showTooltip={true}
    />
  );
};

export const SystemContainer: React.FC<{ data: { label: string; children: Node[] } }> = ({ data }) => {
  return (
    <BaseContainer
      data={{ ...data, label: 'System' }}
      style={{ height: 100 }}
      className="bg-gray-400  font-semibold"
    />
  );
};

export const SystemNode: React.FC<{ data: { label: string; nodeData: Node } }> = ({ data }) => {
  return (
    <BaseNode
      data={data}
      style={{ height: 40 }}
      className="bg-gray-600"
      textClassName="text-center text-white font-semibold"
      handles={[
        { type: data.label === "Exit" ? 'target' : 'source', position: Position.Bottom }
      ]}
      showTooltip={false}

    />
  );
};

export const DeviationContainer: React.FC<{ data: { label: string; children: Node[] } }> = ({ data }) => {
  return (
    <BaseContainer
        data={{ ...data, label: 'Deviation' }}
        style={{ height: 100 }}
        className="bg-yellow-300 bg-opacity-30  font-semibold"
    />
  );
};

export const DeviationNode: React.FC<{ data: { label: string; nodeData: Node } }> = ({ data }) => {
  const bgColorClass = data.label === "Prompt Hack Attempt" 
    ? "bg-red-500"
    : data.label === "User Tangent"
    ? "bg-gray-400"
    : "bg-orange-500";

  return (
    <BaseNode
      data={data}
      style={{ height: 40 }}
      className={bgColorClass}
      handles={[
        { type: 'target', position: Position.Left },
        { type: 'source', position: Position.Right }
      ]}
      showTooltip={true}

    />
  );
};
