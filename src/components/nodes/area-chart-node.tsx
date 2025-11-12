import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, XAxis, YAxis, CartesianGrid, Area } from "recharts";
import { useFieldTypes } from "@/contexts/FieldTypesContext";

interface AreaChartNodeProps {
  nodeId: string;
  executedData?: any[];
  config?: { xField?: string; yField?: string };
}

export const AreaChartNode = ({
  nodeId,
  executedData = [],
  config = {},
}: AreaChartNodeProps) => {
  const { fieldTypes } = useFieldTypes();
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [stringFields, setStringFields] = useState<string[]>([]);
  const [numberFields, setNumberFields] = useState<string[]>([]);

  const actualData = useMemo(() => {
    const nodeResult = executedData.find((d) => d.node_id === nodeId);
    return nodeResult?.output || [];
  }, [executedData, nodeId]);

  useEffect(() => {
    if (!actualData.length) return;

    const fields = Object.keys(actualData[0] || {});
    const strFields = fields.filter((f) => fieldTypes[f] === "string");
    const numFields = fields.filter((f) => fieldTypes[f] === "number");

    setStringFields(strFields);
    setNumberFields(numFields);

    setXField(config.xField || strFields[0] || fields[0] || "");
    setYField(config.yField || numFields[0] || fields[1] || "");
  }, [actualData, fieldTypes, config]);

  useEffect(() => {
    if (!xField || !yField) return;

    const mapped = actualData.map((row: any) => ({
      name: row[xField] ?? "Unknown",
      value: row[yField] ?? 0,
    }));

    setChartData(mapped);
  }, [actualData, xField, yField]);

  const hasData = chartData.length > 0;

  return (
    <BaseNode
      title="Area Chart"
      typeLabel="Visualize"
      inputs={1}
      outputs={0}
      className="border-t-purple-600"
    >
      {/* X-axis selector */}
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

      {/* Y-axis selector */}
      <div>
        <label className="block mb-1 text-gray-600">Y-axis</label>
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
        <div className="space-y-2 text-[10px] w-80 mr-4">
          <div className="flex mt-8 mb-4">
            <ChartContainer
              config={{ value: { label: "Value", color: "#9f7aea" } }}
              className="w-full h-auto"
            >
              <AreaChart data={chartData}>
                {/* Grid */}
                <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />

                {/* X-axis */}
                <XAxis
                  dataKey="name"
                  label={{
                    value: xField,
                    position: "insideBottom",
                    offset: -5,
                  }}
                  tick={{ fontSize: 10 }}
                />

                {/* Y-axis */}
                <YAxis
                  label={{
                    value: yField,
                    angle: -90,
                    position: "insideLeft",
                    offset: 5,
                  }}
                  tick={{ fontSize: 10 }}
                />

                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <Area
                  type="monotone"
                  dataKey="value"
                  fill="#9f7aea"
                  stroke="#9f7aea"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 text-xs pt-4">
          No data to visualize
        </div>
      )}
    </BaseNode>
  );
};
