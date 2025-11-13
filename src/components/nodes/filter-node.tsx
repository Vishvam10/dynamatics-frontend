import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";
import { useFieldTypes } from "@/contexts/FieldTypesContext";
import { Plus, Trash2 } from "lucide-react";

const FILTERS: Record<string, string[]> = {
  number: ["gt", "gte", "lt", "lte", "eq", "neq"],
  string: ["contains", "ncontains", "startswith", "nstartswith", "eq", "neq"],
  boolean: ["eq", "neq"],
  default: ["eq", "neq"],
};

const LOGIC_OPS = ["AND", "OR"];

export const FilterNode = ({ id, data }: any) => {
  const { config = {} } = data;
  const { fields, fieldTypes } = useFieldTypes();
  const { setNodes } = useReactFlow();

  // initialize rules from config
  const [rules, setRules] = useState<
    {
      field: string;
      condition: string;
      value: string | number;
      operator: string;
    }[]
  >(
    config?.rules?.length
      ? config.rules
      : [{ field: "", condition: "", value: "", operator: "AND" }]
  );

  const addRule = () =>
    setRules([
      ...rules,
      { field: "", condition: "", value: "", operator: "AND" },
    ]);

  const removeRule = (idx: number) => {
    const copy = [...rules];
    copy.splice(idx, 1);
    setRules(copy);
  };

  const updateRule = (idx: number, key: string, value: any) => {
    const copy = [...rules];
    copy[idx] = { ...copy[idx], [key]: value };
    setRules(copy);
  };

  const getType = (field: string) => fieldTypes?.[field] ?? "string";

  // sync with top-level node
  useEffect(() => {
    const parsedRules = rules.map((r) => {
      const type = getType(r.field);
      const value =
        type === "number" && r.value !== "" && !isNaN(Number(r.value))
          ? Number(r.value)
          : r.value;
      return { ...r, value };
    });

    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, config: { rules: parsedRules }, data: { ...n.data } }
          : n
      )
    );
  }, [rules, fieldTypes, id, setNodes]);

  return (
    <BaseNode title="Filter" typeLabel="Transform">
      <div className="flex flex-col gap-2">
        {rules.map((r, i) => {
          const type = getType(r.field);
          const conditions = FILTERS[type] || FILTERS.default;

          return (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && (
                <select
                  className="border rounded p-1 text-xs"
                  value={r.operator}
                  onChange={(e) => updateRule(i, "operator", e.target.value)}
                >
                  {LOGIC_OPS.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              )}

              <select
                className="border rounded p-1 text-xs"
                value={r.field}
                onChange={(e) => updateRule(i, "field", e.target.value)}
              >
                <option value="">Field</option>
                {fields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <select
                className="border rounded p-1 text-xs"
                value={r.condition}
                onChange={(e) => updateRule(i, "condition", e.target.value)}
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
                value={r.value}
                onChange={(e) => updateRule(i, "value", e.target.value)}
                placeholder="Value"
              />

              {rules.length > 1 && (
                <button
                  onClick={() => removeRule(i)}
                  className="text-black hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={addRule}
          className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-xs mt-1"
        >
          <Plus size={12} /> Add Rule
        </button>
      </div>
    </BaseNode>
  );
};
