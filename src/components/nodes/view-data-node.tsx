import { useMemo, useEffect, useState } from "react";
import { BaseNode } from "./base-node";
import { DataTable } from "@/components/ui/data-table";
import type { BaseNodeData } from "@/types/node-data";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";

export const ViewDataNode = (props: NodeProps<BaseNodeData>) => {
  const { id, data } = props;
  const executedData = data.executionData ?? [];

  const { setNodes } = useReactFlow();

  // State for column search
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize tableData for this node
  const tableData = useMemo(() => {
    const nodeResult = executedData.find((d: any) => d.node_id === id);
    return nodeResult?.output || [];
  }, [executedData, id]);

  // Filtered tableData based on search term (column names)
  const filteredTableData = useMemo(() => {
    if (!searchTerm) return tableData;
    const lowerSearch = searchTerm.toLowerCase();
    return tableData.map((row: Record<string, any>) => {
      const filteredRow: Record<string, any> = {};
      Object.keys(row).forEach((col) => {
        if (col.toLowerCase().includes(lowerSearch)) {
          filteredRow[col] = row[col];
        }
      });
      return filteredRow;
    });
  }, [tableData, searchTerm]);

  // Ensure config and metadata exist
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              config: { ...(n.data?.config ?? {}) },
              data: {
                ...n.data,
                metadata: { ...(n.data?.metadata ?? {}) },
              },
            }
          : n
      )
    );
  }, [id]);

  return (
    <BaseNode
      title="View Data"
      typeLabel="Export"
      inputs={1}
      outputs={0}
      showSaveButton={true}
      saveTooltipMessage={"Add to dashboard"}
      saveOnVisNodeType="data-table"
      saveOnVisNodeId={id}
    >
      <div className="space-y-2 text-[10px] w-full min-w-[500px]">
        {/* Column search */}
        <input
          type="text"
          placeholder="Search column names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-purple-300"
        />

        {/* Scrollable table container */}
        <div className="w-full max-w-full h-64 overflow-auto border rounded">
          {filteredTableData.length > 0 ? (
            <DataTable data={filteredTableData} pageSize={10} />
          ) : (
            <div className="text-gray-400 text-[10px] text-center py-8">
              No data yet or no matching columns.
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
};
