import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface LineChartNodeProps {
  nodeId: string;
  executedData?: any[];
  fieldTypes?: Record<string, string>;
  config?: { xField?: string; yField?: string };
}

export const LineChartNode = ({
  nodeId,
  executedData = [],
  fieldTypes = {},
  config = {},
}: LineChartNodeProps) => {
  const [xField, setXField] = useState(""); // optional categorical
  const [yField, setYField] = useState(""); // numeric values
  const [chartData, setChartData] = useState<any[]>([]);
  const [stringFields, setStringFields] = useState<string[]>([]);
  const [numberFields, setNumberFields] = useState<string[]>([]);

  const actualData = useMemo(() => {
    const nodeResult = executedData.find((d) => d.node_id === nodeId);
    return nodeResult?.output || [];
  }, [executedData, nodeId]);

  // infer fields
  useEffect(() => {
    if (!actualData.length) return;

    const fields = Object.keys(actualData[0] || {});
    const strFields = fields.filter((f) => fieldTypes[f] === "string");
    const numFields = fields.filter((f) => fieldTypes[f] === "number");

    setStringFields(strFields);
    setNumberFields(numFields);

    setXField(config.xField || strFields[0] || ""); // optional
    setYField(config.yField || numFields[0] || "");
  }, [actualData, fieldTypes, config]);

  // map data (convert to percentages if needed)
  useEffect(() => {
    if (!yField) return;

    const values = actualData.map((row: any) => row[yField] ?? 0);
    const total = values.reduce((acc: any, v: any) => acc + v, 0);

    const mapped = values.map((v: any, i: any) => ({
      name: xField ? actualData[i][xField] ?? `Item ${i + 1}` : `${i + 1}`,
      value: total ? (v / total) * 100 : v,
    }));

    setChartData(mapped);
  }, [actualData, xField, yField]);

  const hasData = chartData.length > 0;

  return (
    <BaseNode
      title="Line Chart"
      typeLabel="Visualize"
      inputs={1}
      outputs={0}
      className="border-t-purple-600"
    >
      {/* X-axis selector */}
      {stringFields.length > 0 && (
        <div>
          <label className="block mb-1 text-gray-600">X-axis</label>
          <select
            value={xField}
            onChange={(e) => setXField(e.target.value)}
            className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-purple-300"
          >
            {stringFields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Y-axis selector */}
      <div>
        <label className="block mb-1 text-gray-600">Values</label>
        <select
          value={yField}
          onChange={(e) => setYField(e.target.value)}
          className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-purple-300"
        >
          {numberFields.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {hasData ? (
        <div className="flex justify-center pt-2 w-80 h-48">
          <ChartContainer
            config={{ value: { label: "Value (%)", color: "#9f7aea" } }}
            className="w-full h-full"
          >
            <LineChart width={300} height={150} data={chartData}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
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
    </BaseNode>
  );
};
