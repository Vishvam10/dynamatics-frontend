import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";

const FILTERS: any = {
  number: ["gt", "gte", "lt", "lte", "eq", "neq"],
  string: ["contains", "ncontains", "startswith", "nstartswith", "eq", "neq"],
  boolean: ["eq", "neq"],
  default: ["eq", "neq"],
};

export const FilterNode = ({ id, data }: any) => {
  const { fields = [], fieldTypes = {}, config = {} } = data;
  const [field, setField] = useState(config.field || "");
  const [condition, setCondition] = useState(config.condition || "");
  const [value, setValue] = useState(config.value ?? "");
  const { setNodes } = useReactFlow();

  const type = fieldTypes?.[field] ?? "string";

  const conditions = useMemo(() => {
    if (FILTERS[type]) return FILTERS[type];
    return FILTERS.default;
  }, [type]);

  // 🔁 Sync config with graph — cast to number if needed
  useEffect(() => {
    const parsedValue =
      type === "number" && value !== "" && !isNaN(Number(value))
        ? Number(value)
        : value;

    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                config: { field, condition, value: parsedValue },
              },
            }
          : n
      )
    );
  }, [field, condition, value, type, id, setNodes]);

  return (
    <BaseNode title="Filter" typeLabel="Transform">
      {/* Field Selector */}
      <select
        className="w-full border rounded p-1 text-sm"
        value={field}
        onChange={(e) => setField(e.target.value)}
      >
        <option value="">Select field</option>
        {fields.map((f: string) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      {/* Condition Selector */}
      <select
        className="w-full border rounded p-1 text-sm mt-2"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">Condition</option>
        {conditions.map((c: string) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Value Input */}
      <input
        className="w-full border rounded p-1 text-sm mt-2"
        type={type === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
      />
    </BaseNode>
  );
};
