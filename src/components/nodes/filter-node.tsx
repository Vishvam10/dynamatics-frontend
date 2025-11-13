import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

const FILTERS: Record<string, string[]> = {
  number: ["gt", "gte", "lt", "lte", "eq", "neq"],
  string: ["contains", "ncontains", "startswith", "nstartswith", "eq", "neq"],
  boolean: ["eq", "neq"],
  default: ["eq", "neq"],
};

interface Rule {
  field: string;
  condition: string;
  value: string | number;
}

export const FilterNode = (props: NodeProps<BaseNodeData>) => {
  const { nodeFieldsTypeMap } = useBuilder();
  const { id, data } = props;
  const { setNodes } = useReactFlow();

  // State for single rule
  const [rule, setRule] = useState<Rule>(
    data.config?.rules?.[0] ?? { field: "", condition: "", value: "" }
  );

  // Force re-render when the nodeFieldsTypeMap for this node updates
  const [fieldTypes, setFieldTypes] = useState<Record<string, string>>(
    nodeFieldsTypeMap[id] || {}
  );
  // console.log("filter : ", nodeFieldsTypeMap);

  useEffect(() => {
    setFieldTypes(nodeFieldsTypeMap[id] || {});
  }, [nodeFieldsTypeMap, id]);

  const updateRule = (key: keyof Rule, value: string | number) => {
    setRule((prev) => ({ ...prev, [key]: value }));
  };

  const type = rule.field ? fieldTypes[rule.field] || "string" : "string";
  const conditions = FILTERS[type] || FILTERS.default;

  // Sync single rule to React Flow node
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              config: { ...(n.data.config || {}), rules: [rule] },
              data: {
                ...n.data,
              },
            }
          : n
      )
    );
  }, [rule, id, setNodes]);

  return (
    <BaseNode title="Filter" typeLabel="Transform">
      <div className="flex items-center gap-1">
        <select
          className="border rounded p-1 text-xs"
          value={rule.field}
          onChange={(e) => updateRule("field", e.target.value)}
        >
          <option value="">Field</option>
          {Object.keys(fieldTypes).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-1 text-xs"
          value={rule.condition}
          onChange={(e) => updateRule("condition", e.target.value)}
        >
          <option value="">Condition</option>
          {conditions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          className="border rounded p-1 text-xs w-16"
          type={type === "number" ? "number" : "text"}
          value={rule.value}
          onChange={(e) => updateRule("value", e.target.value)}
          placeholder="Value"
        />
      </div>
    </BaseNode>
  );
};
