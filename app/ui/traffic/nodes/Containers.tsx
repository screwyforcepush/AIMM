import React from 'react';

// MilestoneNode component
export const MilestoneNode = ({ data }) => {
  return (
    <div className="milestone-node">
      <h3>{data.label}</h3>
      <p>{data.description}</p>
    </div>
  );
};

// SystemContainer component
export const SystemContainer = ({ data }) => {
  return (
    <div className="system-container">
      <h3>{data.label}</h3>
      <p>{data.description}</p>
    </div>
  );
};

// DeviationContainer component
export const DeviationContainer = ({ data }) => {
  return (
    <div className="deviation-container">
      <h3>{data.label}</h3>
      <p>{data.description}</p>
    </div>
  );
};
