import { useState } from "react";
import { BaseNode } from "./base-node";

export const FilterNode = ({ data }: any) => {
  const { fields, fieldTypes } = data;
  const [field, setField] = useState("");
  const [condition, setCondition] = useState("");
  const [value, setValue] = useState("");

  const type = fieldTypes?.[field] ?? "string";
  const conditions =
    type === "number"
      ? [">", "<", ">=", "<=", "=="]
      : type === "boolean"
      ? ["is", "is not"]
      : ["contains", "equals", "startsWith", "endsWith"];

  return (
    <BaseNode
      title="Filter"
      typeLabel="Transform"
    >
      <select
        className="w-full border rounded p-1 text-sm"
        value={field}
        onChange={(e) => setField(e.target.value)}
      >
        <option value="">Select field</option>
        {fields.map((f: string) => (
          <option key={f}>{f}</option>
        ))}
      </select>

      <select
        className="w-full border rounded p-1 text-sm"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">Condition</option>
        {conditions.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        className="w-full border rounded p-1 text-sm"
        type={type === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
      />
    </BaseNode>
  );
};
