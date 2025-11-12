import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";

const AGGREGATES = ["count", "sum", "avg", "min", "max"];

export const GroupNode = ({ id, data }: any) => {
  const { fields = [], config = {} } = data;

  const [selectedFields, setSelectedFields] = useState<string[]>(
    config.selectedFields || [""]
  );
  const [groupByFields, setGroupByFields] = useState<string[]>(
    config.groupByFields || [""]
  );
  const [aggregates, setAggregates] = useState<string[]>(
    config.aggregates || [""]
  );

  const { setNodes } = useReactFlow();

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                config: { selectedFields, groupByFields, aggregates },
              },
            }
          : n
      )
    );
  }, [id, selectedFields, groupByFields, aggregates, setNodes]);

  const addItem = (setter: any, arr: string[]) => setter([...arr, ""]);
  const removeItem = (setter: any, arr: string[], idx: number) => {
    const copy = [...arr];
    copy.splice(idx, 1);
    setter(copy.length ? copy : [""]);
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

  return (
    <BaseNode title="Group" typeLabel="Aggregate">
      <div className="space-y-4">
        {/* 🔹 Group By */}
        <div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Group By</span>
            <button
              onClick={() => addItem(setGroupByFields, groupByFields)}
              className="text-purple-600 hover:text-purple-800"
            >
              <Plus size={12} />
            </button>
          </div>
          {groupByFields.map((f, i) => (
            <div key={i} className="flex gap-1 items-center mt-1">
              <select
                value={f}
                onChange={(e) =>
                  updateItem(setGroupByFields, groupByFields, i, e.target.value)
                }
                className="flex-1 border rounded p-1 text-[10px]"
              >
                <option value="">Select field</option>
                {fields.map((fld: string) => (
                  <option key={fld}>{fld}</option>
                ))}
              </select>
              <button
                onClick={() => removeItem(setGroupByFields, groupByFields, i)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>

        {/* 🔹 Fields */}
        <div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Output Fields</span>
            <button
              onClick={() => addItem(setSelectedFields, selectedFields)}
              className="text-purple-600 hover:text-purple-800"
            >
              <Plus size={12} />
            </button>
          </div>
          {selectedFields.map((f, i) => (
            <div key={i} className="flex gap-1 items-center mt-1">
              <select
                value={f}
                onChange={(e) =>
                  updateItem(
                    setSelectedFields,
                    selectedFields,
                    i,
                    e.target.value
                  )
                }
                className="flex-1 border rounded p-1 text-[10px]"
              >
                <option value="">Select field</option>
                {fields.map((fld: string) => (
                  <option key={fld}>{fld}</option>
                ))}
              </select>
              <button
                onClick={() => removeItem(setSelectedFields, selectedFields, i)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>

        {/* 🔹 Aggregates */}
        <div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Aggregates</span>
            <button
              onClick={() => addItem(setAggregates, aggregates)}
              className="text-purple-600 hover:text-purple-800"
            >
              <Plus size={12} />
            </button>
          </div>
          {aggregates.map((agg, i) => (
            <div key={i} className="flex gap-1 items-center mt-1">
              <select
                value={agg}
                onChange={(e) =>
                  updateItem(setAggregates, aggregates, i, e.target.value)
                }
                className="flex-1 border rounded p-1 text-[10px]"
              >
                <option value="">Select aggregate</option>
                {AGGREGATES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
              <button
                onClick={() => removeItem(setAggregates, aggregates, i)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </BaseNode>
  );
};
