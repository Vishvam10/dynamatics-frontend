import { type Node } from "@xyflow/react";

export type BaseNodeData = Node<
  {
    nodeId : string;
    config: Record<string, any>;
    metadata: Record<string, any>;
    executionData?: any;
  },
  "base"
>;
