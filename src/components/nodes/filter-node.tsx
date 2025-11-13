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
  const builderCtx = useBuilder();
  const nodeFieldTypeMap = builderCtx.nodeFieldsTypeMap;

  const { id, data } = props;
  const { setNodes } = useReactFlow();

  // Single rule state
  const [rule, setRule] = useState<Rule>(
    data.config?.rules?.[0] ?? { field: "", condition: "", value: "" }
  );

  const updateRule = (key: keyof Rule, value: string | number) => {
    setRule((prev) => ({ ...prev, [key]: value }));
  };

  // Get type for this node's field
  const getType = (field: string) =>
    nodeFieldTypeMap?.[id]?.[field] ?? "string";

  // Sync single rule to React Flow node
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== id) return n;
        const currentConfig = (n.data?.config as Record<string, any>) || {};
        return {
          ...n,
          data: {
            ...n.data,
            config: { ...currentConfig, rules: [rule] },
          },
        };
      })
    );
  }, [rule, id, setNodes]);

  const type = getType(rule.field);
  const conditions = FILTERS[type] || FILTERS.default;

  return (
    <BaseNode title="Filter" typeLabel="Transform">
      <div className="flex items-center gap-1">
        <select
          className="border rounded p-1 text-xs"
          value={rule.field}
          onChange={(e) => updateRule("field", e.target.value)}
        >
          <option value="">Field</option>
          {Object.keys(nodeFieldTypeMap?.[id] || {}).map((f) => (
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
