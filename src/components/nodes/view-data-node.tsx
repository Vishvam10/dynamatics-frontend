import { useMemo, useEffect } from "react";
import { BaseNode } from "./base-node";
import { DataTable } from "@/components/ui/data-table";
import type { BaseNodeData } from "@/types/node-data";
import { useReactFlow, type NodeProps } from "@xyflow/react";

export const ViewDataNode = (props: NodeProps<BaseNodeData>) => {
  const { id, data } = props;
  const executedData = data.executionData ?? [];

  const { setNodes } = useReactFlow();

  // Memoize tableData for this node
  const tableData = useMemo(() => {
    const nodeResult = executedData.find((d: any) => d.node_id === id);
    return nodeResult?.output || [];
  }, [executedData, id]);

  // Ensure config and metadata exist
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                config: { ...(n.data?.config ?? {}) },
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
    >
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
