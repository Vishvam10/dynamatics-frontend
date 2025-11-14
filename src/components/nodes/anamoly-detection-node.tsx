import { BaseNode } from "./base-node";
import { type NodeProps } from "@xyflow/react";
import type { BaseNodeData } from "@/types/node-data";

export const AnomalyDetectionNode = (props: NodeProps<BaseNodeData>) => {
  return (
    <BaseNode
      title="Anomaly Detection"
      typeLabel="Machine Learning"
      inputs={1}
      outputs={1}
    >
      This gate performs anomaly detection on attached dataset
    </BaseNode>
  );
};
