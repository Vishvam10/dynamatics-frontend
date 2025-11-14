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

  // Default mergeType
  const [mergeType, setMergeType] = useState(data.config?.how || "inner");

  // Default left/right fields
  const leftInitial =
    data.config?.leftField || Object.keys(nodeFieldTypeMap[id] || {})[0] || "";
  const rightInitial =
    data.config?.rightField || Object.keys(nodeFieldTypeMap[id] || {})[0] || "";

  const [leftField, setLeftField] = useState(leftInitial);
  const [rightField, setRightField] = useState(rightInitial);

  // Update field options when nodeFieldTypeMap changes
  const [fieldOptions, setFieldOptions] = useState<string[]>(
    Object.keys(nodeFieldTypeMap[id] || {})
  );
  useEffect(() => {
    const newOptions = Object.keys(nodeFieldTypeMap[id] || {});
    setFieldOptions(newOptions);

    if (!newOptions.includes(leftField)) setLeftField(newOptions[0] || "");
    if (!newOptions.includes(rightField)) setRightField(newOptions[0] || "");
  }, [nodeFieldTypeMap, id]);

  // Sync config to React Flow node
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              config: {
                ...(n.data?.config || {}),
                how: mergeType,
                left_on: (leftField === "") ? null : leftField.replace("_x", ""),
                right_on: (rightField === "") ? null : rightField.replace("_y", ""),
              },
              data: { ...n.data },
            }
          : n
      )
    );
  }, [mergeType, leftField, rightField, id, setNodes]);

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

      {/* Left Field */}
      <div className="flex flex-col space-y-1 mt-2">
        <label className="text-[10px] font-medium">Left Field</label>
        <select
          className="w-full border rounded p-1 text-sm"
          value={leftField}
          onChange={(e) => setLeftField(e.target.value)}
        >
          <option value="">Select Left Field</option>
          {fieldOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Right Field */}
      <div className="flex flex-col space-y-1 mt-2">
        <label className="text-[10px] font-medium">Right Field</label>
        <select
          className="w-full border rounded p-1 text-sm"
          value={rightField}
          onChange={(e) => setRightField(e.target.value)}
        >
          <option value="">Select Right Field</option>
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
