import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

const FILTERS: Record<string, string[]> = {
  number: ["gt", "gte", "lt", "lte", "eq", "neq", "between"],
  string: ["contains", "ncontains", "startswith", "nstartswith", "eq", "neq"],
  boolean: ["eq", "neq"],
  default: ["eq", "neq"],
};

export interface FilterConfig {
  field: string;
  condition: string;
  value1: string | number;
  value2?: string | number;
}

export const FilterNode = (props: NodeProps<BaseNodeData>) => {
  const { nodeFieldsTypeMap } = useBuilder();
  const { id, data } = props;
  const { setNodes } = useReactFlow();

  // Initialize config with only the allowed keys
  const initialConfig: FilterConfig = {
    field: (data.config as FilterConfig)?.field || "",
    condition: (data.config as FilterConfig)?.condition || "",
    value1: (data.config as FilterConfig)?.value1 || "",
    value2: (data.config as FilterConfig)?.value2,
  };

  const [config, setConfig] = useState<FilterConfig>(initialConfig);

  // Keep local field types updated when builder context changes
  const [fieldTypes, setFieldTypes] = useState<Record<string, string>>(
    nodeFieldsTypeMap[id] || {}
  );

  useEffect(() => {
    setFieldTypes(nodeFieldsTypeMap[id] || {});
  }, [nodeFieldsTypeMap, id]);

  // Determine type of selected field and possible conditions
  const fieldType = config.field
    ? fieldTypes[config.field] || "string"
    : "string";
  const conditions = FILTERS[fieldType] || FILTERS.default;

  // Update config locally
  const updateConfig = (key: keyof FilterConfig, value: string | number) => {
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
    <BaseNode title="Filter" typeLabel="Transform">
      <div className="flex items-center gap-1">
        {/* Field selector */}
        <select
          className="border rounded p-1 text-xs"
          value={config.field}
          onChange={(e) => updateConfig("field", e.target.value)}
        >
          <option value="">Field</option>
          {Object.keys(fieldTypes).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Condition selector */}
        <select
          className="border rounded p-1 text-xs"
          value={config.condition}
          onChange={(e) => updateConfig("condition", e.target.value)}
        >
          <option value="">Condition</option>
          {conditions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Value1 input */}
        <input
          className="border rounded p-1 text-xs w-16"
          type={fieldType === "number" ? "number" : "text"}
          value={config.value1}
          onChange={(e) => updateConfig("value1", e.target.value)}
          placeholder="Value1"
        />

        {/* Value2 input only for 'between' */}
        {config.condition === "between" && (
          <input
            className="border rounded p-1 text-xs w-16"
            type={fieldType === "number" ? "number" : "text"}
            value={config.value2 || ""}
            onChange={(e) => updateConfig("value2", e.target.value)}
            placeholder="Value2"
          />
        )}
      </div>
    </BaseNode>
  );
};
