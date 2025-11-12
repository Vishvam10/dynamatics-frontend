import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";

const MERGE_TYPES = ["inner", "outer", "left", "right"];

export const MergeNode = ({ id, data, fields = [], fieldTypes = {}, config = {} }: any) => {
  const { setNodes } = useReactFlow();

  const [mergeType, setMergeType] = useState(config?.mergeType || "inner");
  const [mergeField, setMergeField] = useState(config?.mergeField || "");

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, config: { how: mergeType, "on": mergeField } } : n
      )
    );
  }, [id, mergeType, mergeField, setNodes]);

  return (
    <BaseNode title="Merge" typeLabel="Transform" inputs={2} outputs={1}>
      {/* Merge Type */}
      <div className="flex flex-col space-y-1">
        <label className="text-[10px] font-medium">Merge Type</label>
        <select
          className="w-full border rounded p-1 text-sm"
          value={mergeType}
          onChange={(e) => setMergeType(e.target.value)}
        >
          {MERGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Merge On Field */}
      <div className="flex flex-col space-y-1 mt-2">
        <label className="text-[10px] font-medium">Merge On Field</label>
        <select
          className="w-full border rounded p-1 text-sm"
          value={mergeField}
          onChange={(e) => setMergeField(e.target.value)}
        >
          <option value="">Select Field</option>
          {fields.map((f: string) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
};
