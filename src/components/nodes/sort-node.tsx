import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

export const SortNode = (props: NodeProps<BaseNodeData>) => {
  const { id, data } = props;
  const builderCtx = useBuilder();
  const nodeFieldTypeMap = builderCtx.nodeFieldsTypeMap;
  const { setNodes } = useReactFlow();

  const [field, setField] = useState(data.config?.field || "");
  const [asc, setAsc] = useState(data.config?.asc ?? true);

  const fieldOptions = Object.keys(nodeFieldTypeMap?.[id] || {});

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== id) return n;
        const currentConfig = (n.data?.config as Record<string, any>) || {};
        const currentData = n.data || {};
        return {
          ...n,
          data: {
            ...currentData,
            config: { ...currentConfig, field, asc },
          },
        };
      })
    );
  }, [field, asc, id, setNodes]);

  return (
    <BaseNode title="Sort" typeLabel="Transform">
      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        className="w-full border rounded p-1 text-xs"
      >
        <option value="">Select field</option>
        {fieldOptions.map((f) => (
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
