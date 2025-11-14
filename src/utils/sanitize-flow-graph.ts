type FlowGraph = {
  nodes: any[];
  edges: any[];
  viewport?: any;
};

// Only for debugging purposes
export function sanitizeFlowGraph(graph: FlowGraph) {
  const cleanNodes = graph.nodes.map((node) => {
    const { id, type, data, config } = node;
    return { id, type, data, config };
  });

  const cleanEdges = graph.edges.map((edge) => {
    const { id, source, sourceHandle, target, targetHandle } = edge;
    return { id, source, sourceHandle, target, targetHandle };
  });

  return {
    nodes: cleanNodes,
    edges: cleanEdges,
  };
}
