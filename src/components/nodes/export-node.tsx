import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { DataTable } from "@/components/ui/data-table";

interface ExportNodeProps {
  id: string; // node id
  executedData?: any[]; // full flow execution result
  data?: {
    fields?: string[];
    config?: any;
  };
}

export const ViewDataNode = ({ id, executedData = [] }: ExportNodeProps) => {
  const [format, setFormat] = useState("CSV");
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const nodeResult = executedData.find((d) => d.node_id === id);
    if (nodeResult?.output) setTableData(nodeResult.output);
    else setTableData([]);
  }, [executedData, id]);

  return (
    <BaseNode title="View Data" typeLabel="Export" inputs={1} outputs={0}>
      <div className="space-y-2 text-[10px] w-full min-w-[500px]">
        {/* <label className="block text-[10px]">File Format</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full border rounded p-1 text-xs"
        >
          <option>CSV</option>
          <option>JSON</option>
        </select> */}

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
