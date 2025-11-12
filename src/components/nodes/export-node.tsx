import { useState } from "react";
import { BaseNode } from "./base-node";

interface ExportNodeProps {
  data?: {
    fields?: string[];
  };
}

export const ExportDataNode = ({ data }: ExportNodeProps) => {
  const [format, setFormat] = useState("CSV");

  return (
    <BaseNode title="Export Data" typeLabel="Export" inputs={1} outputs={0}>
      <div className="space-y-1 text-[10px]">
        <label>File Format</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full border border-gray-300 rounded p-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-300"
        >
          <option>CSV</option>
          <option>JSON</option>
        </select>
      </div>
    </BaseNode>
  );
};
