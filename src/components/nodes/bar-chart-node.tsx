import { useState } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

interface BarChartNodeProps {
  data: {
    fields: string[];
  };
}

const defaultChartData = [
  { name: "A", value: 40 },
  { name: "B", value: 30 },
  { name: "C", value: 20 },
  { name: "D", value: 10 },
];

const chartConfig: ChartConfig = {
  value: { label: "Value", color: "#805ad5" }, // purple-500
};

export const BarChartNode = ({ data }: BarChartNodeProps) => {
  const { fields = [] } = data;
  const [xField, setXField] = useState(fields[0] || "");
  const [yField, setYField] = useState(fields[1] || "");

  const hasData = fields && fields.length > 0;

  return (
    <BaseNode
      title="Bar Chart"
      typeLabel="Visualize"
      inputs={1}
      outputs={0}
      className="border-t-purple-600"
    >
      <div className="space-y-2 text-[10px]">
        {/* Field selectors */}
        <div>
          <label className="block mb-1 text-gray-600">X-axis</label>
          <select
            value={xField}
            onChange={(e) => setXField(e.target.value)}
            className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-purple-300"
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
            className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-purple-300"
          >
            {fields.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Chart */}
        {hasData ? (
          <div className="flex justify-center pt-2">
            <ChartContainer config={chartConfig} className="w-28 h-28">
              <BarChart width={110} height={110} data={defaultChartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" fill="#805ad5" radius={[3, 3, 0, 0]} />
              </BarChart>
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
