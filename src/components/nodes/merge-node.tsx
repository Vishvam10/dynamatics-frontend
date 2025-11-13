import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

const MERGE_TYPES = ["inner", "outer", "left", "right"];

export const MergeNode = (props: NodeProps<BaseNodeData>) => {
  const { id, data } = props;
  const builderCtx = useBuilder();
  const nodeFieldTypeMap = builderCtx.nodeFieldsTypeMap;
  const { setNodes } = useReactFlow();

  const [mergeType, setMergeType] = useState(data.config?.mergeType || "inner");
  const [mergeField, setMergeField] = useState(data.config?.mergeField || "");

  // Sync to node config
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== id) return n;
        const currentData = n.data || {};
        const currentConfig = (n.data?.config as Record<string, any>) || {};
        return {
          ...n,
          data: {
            ...currentData,
            config: {
              ...currentConfig,
              mergeType,
              mergeField,
            },
          },
        };
      })
    );
  }, [mergeType, mergeField, id, setNodes]);

  // Only use fields allowed for this node
  const fieldOptions = Object.keys(nodeFieldTypeMap?.[id] || {});

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
          {fieldOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
};
