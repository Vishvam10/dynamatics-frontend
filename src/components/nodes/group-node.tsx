import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { BaseNode } from "./base-node";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

const AGGREGATES = [
  "count",
  "sum",
  "mean",
  "min",
  "max",
  "std",
  "var",
  "nunique",
  "median",
];

export const GroupNode = (props: NodeProps<BaseNodeData>) => {
  const { id, data } = props;
  const builderCtx = useBuilder();
  const nodeFieldTypeMap = builderCtx.nodeFieldsTypeMap;
  const { setNodes } = useReactFlow();

  const [groupByFields, setGroupByFields] = useState<string[]>(
    data.config?.group_by ?? []
  );
  const [aggregates, setAggregates] = useState<string[]>(
    data.config?.aggregations ?? []
  );
  const [selectedFields, setSelectedFields] = useState<string[]>(
    data.config?.fields ?? []
  );

  const fieldOptions = Object.keys(nodeFieldTypeMap?.[id] || {});

  // Sync with top-level node config
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
              group_by: groupByFields,
              aggregations: aggregates,
              fields: selectedFields,
            },
          },
        };
      })
    );
  }, [groupByFields, aggregates, selectedFields, id, setNodes]);

  const addItem = (setter: any, arr: string[]) => setter([...arr, ""]);
  const removeItem = (setter: any, arr: string[], idx: number) =>
    setter(arr.filter((_, i) => i !== idx));
  const updateItem = (
    setter: any,
    arr: string[],
    idx: number,
    value: string
  ) => {
    const copy = [...arr];
    copy[idx] = value;
    setter(copy);
  };

  const renderSelectList = (
    arr: string[],
    setter: any,
    options: string[],
    label: string
  ) => (
    <div className="space-y-1 overflow-visible">
      <div className="flex justify-between items-center gap-1">
        <span className="font-medium text-[10px] truncate">{label}</span>
        <button
          onClick={() => addItem(setter, arr)}
          className="text-purple-600 hover:text-purple-800 shrink-0 w-4 h-4 flex items-center justify-center"
          title={`Add ${label}`}
        >
          <Plus size={10} />
        </button>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
        {arr.length === 0 ? (
          <div className="text-[9px] text-gray-400 italic py-1">
            Click + to add
          </div>
        ) : (
          arr.map((val, i) => (
            <div key={i} className="flex gap-1 items-center">
              <select
                value={val}
                onChange={(e) => updateItem(setter, arr, i, e.target.value)}
                className="flex-1 border rounded px-1 py-0.5 text-[10px] min-w-0 max-w-full"
              >
                <option value="">Select</option>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeItem(setter, arr, i)}
                className="text-gray-400 hover:text-red-500 shrink-0 w-4 h-4 flex items-center justify-center"
                title="Remove"
              >
                <Trash2 size={9} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <BaseNode title="Group" typeLabel="Aggregate">
      <div className="space-y-2 w-44 max-w-full overflow-hidden">
        {renderSelectList(
          groupByFields,
          setGroupByFields,
          fieldOptions,
          "Group By"
        )}
        {renderSelectList(
          aggregates,
          setAggregates,
          AGGREGATES,
          "Aggregate Func"
        )}
        {renderSelectList(
          selectedFields,
          setSelectedFields,
          fieldOptions,
          "Aggregate On"
        )}
      </div>
    </BaseNode>
  );
};
