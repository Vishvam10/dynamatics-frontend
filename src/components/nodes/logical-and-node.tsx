import { BaseNode } from "./base-node";
import { type NodeProps } from "@xyflow/react";
import type { BaseNodeData } from "@/types/node-data";

export const LogicalAndNode = (props: NodeProps<BaseNodeData>) => {
  return (
    <BaseNode
      title="Logical And"
      typeLabel="Boolean"
      inputs={4}
      outputs={1}
    >This gate performs an <br></br> AND operation on <br></br>previous filters</BaseNode>
  );
};
