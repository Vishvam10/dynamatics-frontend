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
  const { id, data } = props;
  const { nodeFieldsTypeMap } = useBuilder();
  const { setNodes } = useReactFlow();

  const initialConfig: FilterConfig = {
    field: (data.config as FilterConfig)?.field || "",
    condition: (data.config as FilterConfig)?.condition || "",
    value1: (data.config as FilterConfig)?.value1 || "",
    value2: (data.config as FilterConfig)?.value2 || "",
  };

  const [config, setConfig] = useState<FilterConfig>(initialConfig);

  const [fieldTypes, setFieldTypes] = useState<Record<string, string>>(
    nodeFieldsTypeMap[id] || {}
  );

  useEffect(() => {
    setFieldTypes(nodeFieldsTypeMap[id] || {});
  }, [nodeFieldsTypeMap, id]);

  const fieldType = config.field
    ? fieldTypes[config.field] || "string"
    : "string";
  const conditions = FILTERS[fieldType] || FILTERS.default;

  const updateConfig = (key: keyof FilterConfig, value: string | number) => {
    // Parse numbers if needed
    if (fieldType === "number" && (key === "value1" || key === "value2")) {
      const parsed = value === "" ? "" : Number(value);
      setConfig((prev) => ({ ...prev, [key]: parsed }));
    } else {
      setConfig((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Sync with React Flow
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, config: { ...config }, data: { ...n.data } } : n
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

        {/* Value1 */}
        <input
          className="border rounded p-1 text-xs w-16"
          type={fieldType === "number" ? "number" : "text"}
          value={config.value1}
          onChange={(e) => updateConfig("value1", e.target.value)}
          placeholder="Value1"
        />

        {/* Value2 only for 'between' */}
        {config.condition === "between" && (
          <input
            className="border rounded p-1 text-xs w-16"
            type={fieldType === "number" ? "number" : "text"}
            value={config.value2}
            onChange={(e) => updateConfig("value2", e.target.value)}
            placeholder="Value2"
          />
        )}
      </div>
    </BaseNode>
  );
};
