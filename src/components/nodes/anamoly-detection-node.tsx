import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

export interface AnomalyDetectionConfig {
  field: string;
}

export const AnomalyDetectionNode = (props: NodeProps<BaseNodeData>) => {
  const { id, data } = props;
  const { nodeFieldsTypeMap } = useBuilder();
  const { setNodes } = useReactFlow();

  // Initialize config
  const initialConfig: AnomalyDetectionConfig = {
    field: (data.config as AnomalyDetectionConfig)?.field || "",
  };
  const [config, setConfig] = useState<AnomalyDetectionConfig>(initialConfig);

  // Keep local field types updated when builder context changes
  const [fieldTypes, setFieldTypes] = useState<Record<string, string>>(
    nodeFieldsTypeMap[id] || {}
  );

  useEffect(() => {
    setFieldTypes(nodeFieldsTypeMap[id] || {});
  }, [nodeFieldsTypeMap, id]);

  // Update config locally
  const updateConfig = (value: string) => {
    setConfig({ field: value });
  };

  // Sync config to React Flow node whenever it changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              config: { ...config },
              data: { ...n.data },
            }
          : n
      )
    );
  }, [config, id, setNodes]);

  return (
    <BaseNode
      title="Anomaly Detection"
      typeLabel="Machine Learning"
      inputs={1}
      outputs={1}
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Select field to analyze for anomalies
        </p>
        <select
          className="border rounded p-1 text-xs"
          value={config.field}
          onChange={(e) => updateConfig(e.target.value)}
        >
          <option value="">Select Field</option>
          {Object.keys(fieldTypes).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
};
