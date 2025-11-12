import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";

export const SortNode = ({ id, data, fields = [], fieldTypes = {}, config = {} }: any) => {
  const { setNodes } = useReactFlow();

  const [field, setField] = useState(config?.field || "");
  const [asc, setAsc] = useState(config?.asc ?? true);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, config: { field, asc }, data: { ...n.data } } : n
      )
    );
  }, [id, field, asc, setNodes]);

  return (
    <BaseNode title="Sort" typeLabel="Transform">
      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        className="w-full border rounded p-1 text-xs"
      >
        <option value="">Select field</option>
        {fields.map((f: string) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-[10px] mt-2">
        <input type="checkbox" checked={asc} onChange={() => setAsc(!asc)} />
        {asc ? "Ascending" : "Descending"}
      </label>
    </BaseNode>
  );
};
