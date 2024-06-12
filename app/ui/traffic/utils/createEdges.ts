import { Edge } from '../types';

/**
 * Function to create edges for the traffic visualization feature.
 * This function takes raw data and transforms it into edges that can be used by React Flow.
 * @param {Edge[]} edgesData - The raw data for the edges.
 * @returns {any[]} - An array of edges formatted for React Flow.
 */
export const createEdges = (edgesData: Edge[]): any[] => {
  return edgesData.map(edge => ({
    id: `e${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    label: `${edge.trafficVolume}`,
    animated: edge.trafficVolume > 1,
    style: { stroke: '#000' },
  }));
};
