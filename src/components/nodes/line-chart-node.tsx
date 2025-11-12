import { useState } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";

interface LineChartNodeProps {
  data: {
    fields: string[];
  };
}

const defaultChartData = [
  { name: "A", value: 10 },
  { name: "B", value: 20 },
  { name: "C", value: 15 },
  { name: "D", value: 30 },
];

const chartConfig: ChartConfig = {
  value: { label: "Value", color: "#9f7aea" }, // purple-400
};

export const LineChartNode = ({ data }: LineChartNodeProps) => {
  const { fields = [] } = data;
  const [xField, setXField] = useState(fields[0] || "");
  const [yField, setYField] = useState(fields[1] || "");
  const hasData = fields && fields.length > 0;

  return (
    <BaseNode
      title="Line Chart"
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

        {hasData ? (
          <div className="flex justify-center pt-2">
            <ChartContainer config={chartConfig} className="w-28 h-28">
              <LineChart width={110} height={110} data={defaultChartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#9f7aea"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
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
