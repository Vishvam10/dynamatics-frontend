import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";

const MERGE_TYPES = ["concat", "union", "intersection"];

export const MergeNode = ({ id, data }: any) => {
  const { config = {} } = data;
  const [mergeType, setMergeType] = useState(config.mergeType || "concat");
  const [keyField, setKeyField] = useState(config.keyField || "");
  const { fields = [] } = data;

  const { setNodes } = useReactFlow();

  // Sync node config with React Flow state
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                config: { mergeType, keyField },
              },
            }
          : n
      )
    );
  }, [mergeType, keyField, id, setNodes]);

  return (
    <BaseNode title="Merge" typeLabel="Transform" inputs={2} outputs={1}>
      {/* Merge Type Selector */}
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

      {/* Key Field Selector */}
      <div className="flex flex-col space-y-1 mt-2">
        <label className="text-[10px] font-medium">Key Field</label>
        <select
          className="w-full border rounded p-1 text-sm"
          value={keyField}
          onChange={(e) => setKeyField(e.target.value)}
        >
          <option value="">Select key field</option>
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
