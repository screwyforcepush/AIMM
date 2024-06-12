import { Node } from '../types';

/**
 * Function to create nodes for the traffic visualization feature.
 * This function takes raw data and transforms it into nodes that can be used by React Flow.
 * @param {Node[]} nodesData - The raw data for the nodes.
 * @returns {any[]} - An array of nodes formatted for React Flow.
 */
export const createNodes = (nodesData: Node[]): any[] => {
  return nodesData.map(node => ({
    id: node.id,
    type: node.type,
    data: { label: node.label, description: node.description },
    position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random positions for demonstration purposes
  }));
};
