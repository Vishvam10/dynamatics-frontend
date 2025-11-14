import { BaseNode } from "./base-node";
import { type NodeProps } from "@xyflow/react";
import type { BaseNodeData } from "@/types/node-data";

export const LogicalOrNode = (props: NodeProps<BaseNodeData>) => {
  return (
    <BaseNode
      title="Logical Or"
      typeLabel="Boolean"
      inputs={2}
      outputs={1}
    >This gate performs an <br></br> OR operation on <br></br>previous filters</BaseNode>
  );
};
