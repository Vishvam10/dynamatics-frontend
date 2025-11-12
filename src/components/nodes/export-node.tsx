import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExportNodeProps {
  id: string; // node id
  executedData?: any[]; // full flow execution result
  data?: {
    fields?: string[];
    config?: any;
  };
}

export const ExportDataNode = ({ id, executedData = [] }: ExportNodeProps) => {
  const [format, setFormat] = useState("CSV");
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const nodeResult = executedData.find((d) => d.node_id === id);
    if (nodeResult?.output) setTableData(nodeResult.output);
    else setTableData([]);
  }, [executedData, id]);

  const columns = tableData[0] ? Object.keys(tableData[0]) : [];

  return (
    <BaseNode title="Export Data" typeLabel="Export" inputs={1} outputs={0}>
      <div className="space-y-2 text-[10px]">
        <label className="block text-[10px]">File Format</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full border rounded p-1 text-xs"
        >
          <option>CSV</option>
          <option>JSON</option>
        </select>

        {tableData.length > 0 ? (
          <div className="border rounded mt-1 max-h-64 overflow-auto w-full">
            <Table className="text-xs min-w-full">
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col}>{row[col]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-gray-400 text-[10px]">No data yet</div>
        )}
      </div>
    </BaseNode>
  );
};
