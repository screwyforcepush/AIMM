// Utility functions and constants for graph construction and manipulation

/**
 * Generates a unique ID for nodes and edges in the graph.
 * @returns {string} A unique ID.
 */
export const generateUniqueId = (): string => {
  return `id-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculates the average cost of messages for a node.
 * @param {number[]} costs - An array of message costs associated with a node.
 * @returns {number} The average cost.
 */
export const calculateAverageCost = (costs: number[]): number => {
  return costs.reduce((acc, cost) => acc + cost, 0) / costs.length;
};

/**
 * Determines the sentiment of a node based on the associated messages.
 * @param {string[]} sentiments - An array of sentiments from messages associated with a node.
 * @returns {string} The overall sentiment.
 */
export const determineNodeSentiment = (sentiments: string[]): string => {
  const sentimentCounts = sentiments.reduce((acc, sentiment) => {
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(sentimentCounts).reduce((a, b) => sentimentCounts[a] > sentimentCounts[b] ? a : b);
};

/**
 * Formats node data for display in the traffic visualization.
 * @param {object} nodeData - The data associated with a node.
 * @returns {object} Formatted node data.
 */
export const formatNodeData = (nodeData: any): any => {
  return {
    ...nodeData,
    label: `${nodeData.label} (${nodeData.type})`,
    description: nodeData.description || 'No description available.',
  };
};
