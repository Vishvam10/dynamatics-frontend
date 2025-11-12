import { useState } from "react";
import { BaseNode } from "./base-node";

const chartTypes = ["Bar Chart", "Line Chart", "Pie Chart"];

interface VisualizeNodeProps {
  data: {
    fields: string[];
  };
}

export const VisualizeNode = ({ data }: VisualizeNodeProps) => {
  const { fields = [] } = data;

  const [chartType, setChartType] = useState(chartTypes[0]);
  const [xField, setXField] = useState(fields[0] || "");
  const [yField, setYField] = useState(fields[1] || "");

  return (
    <BaseNode
      title="Visualize"
      typeLabel="Visualize"
      inputs={1}
      outputs={0}
      className="border-t-purple-600"
    >
      <div className="space-y-1 text-[10px]">
        <div>
          <label>Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full border border-gray-300 rounded p-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-300"
          >
            {chartTypes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label>X-axis</label>
          <select
            value={xField}
            onChange={(e) => setXField(e.target.value)}
            className="w-full border border-gray-300 rounded p-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-300"
          >
            {fields.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Y-axis</label>
          <select
            value={yField}
            onChange={(e) => setYField(e.target.value)}
            className="w-full border border-gray-300 rounded p-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-300"
          >
            {fields.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
