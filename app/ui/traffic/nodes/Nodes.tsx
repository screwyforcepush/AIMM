import React from 'react';

// MilestoneStepNode component
export const MilestoneStepNode = ({ data }) => {
  return (
    <div className="milestone-step-node">
      <h3>{data.label}</h3>
      <p>{data.description}</p>
    </div>
  );
};

// SystemNode component
export const SystemNode = ({ data }) => {
  return (
    <div className="system-node">
      <h3>{data.label}</h3>
      <p>{data.description}</p>
    </div>
  );
};

// DeviationNode component
export const DeviationNode = ({ data }) => {
  return (
    <div className="deviation-node">
      <h3>{data.label}</h3>
      <p>{data.description}</p>
    </div>
  );
};
