import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { DataTable } from "@/components/ui/data-table";
import type { BaseNodeData } from "@/types/node-data";
import { useReactFlow, type NodeProps } from "@xyflow/react";

export const ViewDataNode = (props: NodeProps<BaseNodeData>) => {
  const { id, data } = props;
  const { executedData = [] } = data.metadata || {}; // execution results from flow
  const { setNodes } = useReactFlow();

  const [tableData, setTableData] = useState<any[]>([]);

  // Update table when executedData changes
  useEffect(() => {
    const nodeResult = executedData.find((d: any) => d.node_id === id);
    setTableData(nodeResult?.output || []);
  }, [executedData, id]);

  // Optionally sync tableData to node config/metadata if needed
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                metadata: { ...(n.data.metadata || {}), tableData },
              },
            }
          : n
      )
    );
  }, [tableData, id, setNodes]);

  return (
    <BaseNode title="View Data" typeLabel="Export" inputs={1} outputs={0}>
      <div className="space-y-2 text-[10px] w-full min-w-[500px]">
        {tableData.length > 0 ? (
          <DataTable data={tableData} pageSize={10} />
        ) : (
          <div className="text-gray-400 text-[10px] text-center py-8 border rounded">
            No data yet. Run the flow to see results.
          </div>
        )}
      </div>
    </BaseNode>
  );
};
