import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";
import { useFieldTypes } from "@/contexts/FieldTypesContext";

const AGGREGATES = [
  "count",
  "sum",
  "mean",
  "min",
  "max",
  "std",
  "var",
  "count",
  "nunique",
  "median",
];

export const GroupNode = ({ id, data }: any) => {
  const { config = {} } = data;
  const { fields } = useFieldTypes();
  const { setNodes } = useReactFlow();

  // Initialize from config or empty arrays
  const [selectedFields, setSelectedFields] = useState<string[]>(
    config?.fields && config.fields.length ? config.fields : []
  );
  const [groupByFields, setGroupByFields] = useState<string[]>(
    config?.group_by && config.group_by.length ? config.group_by : []
  );
  const [aggregates, setAggregates] = useState<string[]>(
    config?.aggregations && config.aggregations.length
      ? config.aggregations
      : []
  );

  // Sync with top-level node config
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              config: {
                fields: selectedFields,
                group_by: groupByFields,
                aggregations: aggregates,
              },
              data: { ...n.data },
            }
          : n
      )
    );
  }, [id, selectedFields, groupByFields, aggregates, setNodes]);

  const addItem = (setter: any, arr: string[]) => setter([...arr, ""]);
  const removeItem = (setter: any, arr: string[], idx: number) => {
    const copy = [...arr];
    copy.splice(idx, 1);
    setter(copy);
  };
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
          className="text-purple-600 hover:text-purple-800 flex-shrink-0 w-4 h-4 flex items-center justify-center"
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
                className="text-gray-400 hover:text-red-500 flex-shrink-0 w-4 h-4 flex items-center justify-center"
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
        {renderSelectList(groupByFields, setGroupByFields, fields, "Group By")}
        {renderSelectList(
          aggregates,
          setAggregates,
          AGGREGATES,
          "Aggregate Func"
        )}
        {renderSelectList(
          selectedFields,
          setSelectedFields,
          fields,
          "Aggregate On"
        )}
      </div>
    </BaseNode>
  );
};
