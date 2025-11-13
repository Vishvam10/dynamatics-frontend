import { BaseNode } from "./base-node";
import { type NodeProps } from "@xyflow/react";
import type { BaseNodeData } from "@/types/node-data";

export const OrNode = (props: NodeProps<BaseNodeData>) => {
  return (
    <BaseNode title="Logical Or" typeLabel="Boolean" inputs={4} outputs={1}></BaseNode>
  );
};
