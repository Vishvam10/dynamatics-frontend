import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";

const FILTERS: Record<string, string[]> = {
  number: ["gt", "gte", "lt", "lte", "eq", "neq"],
  string: ["contains", "ncontains", "startswith", "nstartswith", "eq", "neq"],
  boolean: ["eq", "neq"],
  default: ["eq", "neq"],
};

export const FilterNode = ({ id, data }: any) => {
  const { fields = [], fieldTypes = {}, config = {} } = data;
  const { setNodes } = useReactFlow();

  const [field, setField] = useState(config?.field || "");
  const [condition, setCondition] = useState(config?.condition || "");
  const [value, setValue] = useState(config?.value ?? "");


  const type = fieldTypes?.[field] ?? "string";

  const conditions = useMemo(() => FILTERS[type] || FILTERS.default, [type]);

  // 🔁 Sync config with top-level node
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
              config: { field, condition, value: parsedValue },
              data: { ...n.data },
            }
          : n
      )
    );
  }, [field, condition, value, type, id, setNodes]);

  return (
    <BaseNode title="Filter" typeLabel="Transform">
     <div className="flex flex-col w-24">
       <select
        className="border rounded p-1 text-sm"
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

      <select
        className="border rounded p-1 text-sm mt-2"
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

      <input
        className="border rounded p-1 text-sm mt-2"
        type={type === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
      />
     </div>
    </BaseNode>
  );
};
