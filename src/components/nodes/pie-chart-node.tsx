import { useState } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

interface PieChartNodeProps {
  data: {
    fields: string[];
  };
}

const defaultChartData = [
  { name: "A", value: 40, fill: "#9f7aea" }, // purple-400
  { name: "D", value: 10, fill: "#553c9a" }, // purple-700
];

const chartConfig: ChartConfig = {
  A: { label: "A", color: "#9f7aea" },
  D: { label: "D", color: "#553c9a" },
};

export const PieChartNode = ({ data }: PieChartNodeProps) => {
  const { fields = [] } = data;

  const [xField, setXField] = useState(fields[0] || "");
  const [yField, setYField] = useState(fields[1] || "");

  const hasData = fields && fields.length > 0;

  return (
    <BaseNode
      title="Pie Chart"
      typeLabel="Visualize"
      inputs={1}
      outputs={0}
      className="border-t-purple-600"
    >
      <div className="space-y-2 text-[10px]">
        <div>
          <label className="block mb-1 text-gray-600">X-axis</label>
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
          <label className="block mb-1 text-gray-600">Y-axis</label>
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

        {/* Chart preview */}
        {hasData ? (
          <div className="flex justify-center pt-2">
            <ChartContainer config={chartConfig} className="w-24 h-24">
              <PieChart width={100} height={100}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={defaultChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={40}
                  stroke="#f3e8ff"
                  strokeWidth={1}
                />
              </PieChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="text-center text-gray-400 text-xs pt-4">
            No data to visualize
          </div>
        )}
      </div>
    </BaseNode>
  );
};
