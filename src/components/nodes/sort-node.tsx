import { useState } from "react";
import { BaseNode } from "./base-node";

export const SortNode = ({ data }: any) => {
  const { fields = [] } = data;
  const [field, setField] = useState("");
  const [asc, setAsc] = useState(true);

  return (
    <BaseNode
      title="Sort"
      typeLabel="Transform"
    >
      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        className="w-full border rounded p-1 text-xs"
      >
        <option value="">Select field</option>
        {fields.map((f: string) => (
          <option key={f}>{f}</option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-[10px]">
        <input type="checkbox" checked={asc} onChange={() => setAsc(!asc)} />
        {asc ? "Ascending" : "Descending"}
      </label>
    </BaseNode>
  );
};
