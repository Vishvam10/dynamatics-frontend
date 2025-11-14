import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

export interface ForecastConfig {
  target: string;
  ts_col: string; // new field
}

export const ForecastNode = (props: NodeProps<BaseNodeData>) => {
  const { id, data } = props;
  const { nodeFieldsTypeMap } = useBuilder();
  const { setNodes } = useReactFlow();

  // Initialize config
  const initialConfig: ForecastConfig = {
    target: (data.config as ForecastConfig)?.target || "",
    ts_col: (data.config as ForecastConfig)?.ts_col || "",
  };
  const [config, setConfig] = useState<ForecastConfig>(initialConfig);

  // Keep local field types updated when builder context changes
  const [fieldTypes, setFieldTypes] = useState<Record<string, string>>(
    nodeFieldsTypeMap[id] || {}
  );

  useEffect(() => {
    setFieldTypes(nodeFieldsTypeMap[id] || {});
  }, [nodeFieldsTypeMap, id]);

  // Filter timestamp fields
  const ts_cols = Object.keys(fieldTypes).filter(
    (f) => f === "timestamp" || f.startsWith("timestamp")
  );

  // Update config locally
  const updateConfig = (key: keyof ForecastConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
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
      title="Forecast"
      typeLabel="Machine Learning"
      inputs={1}
      outputs={1}
    >
      <div className="flex flex-col gap-2">
        {/* Field to analyze */}
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Select field to analyze
          </p>
          <select
            className="border rounded p-1 text-xs w-full"
            value={config.target}
            onChange={(e) => updateConfig("target", e.target.value)}
          >
            <option value="">Select Field</option>
            {Object.keys(fieldTypes).map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Timestamp field */}
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Select timestamp field
          </p>
          <select
            className="border rounded p-1 text-xs w-full"
            value={config.ts_col}
            onChange={(e) => updateConfig("ts_col", e.target.value)}
          >
            <option value="">Select Timestamp Field</option>
            {ts_cols.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
