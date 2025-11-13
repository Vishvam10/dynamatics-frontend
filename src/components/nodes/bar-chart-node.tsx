import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useFieldTypes } from "@/contexts/FieldTypesContext";
import { useReactFlow } from "@xyflow/react";

interface BarChartNodeProps {
  nodeId: string;
  executedData?: any[];
  config?: { xField?: string; yField?: string };
}

export const BarChartNode = ({
  nodeId,
  executedData = [],
  config = {},
}: BarChartNodeProps) => {
  const { fields, fieldTypes } = useFieldTypes();
  const { setNodes } = useReactFlow();
  const [xField, setXField] = useState(config.xField || "");
  const [yField, setYField] = useState(config.yField || "");
  const [chartData, setChartData] = useState<any[]>([]);
  const [stringFields, setStringFields] = useState<string[]>([]);
  const [numberFields, setNumberFields] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  const actualData = useMemo(() => {
    const nodeResult = executedData.find((d) => d.node_id === nodeId);
    return nodeResult?.output || [];
  }, [executedData, nodeId]);

  useEffect(() => {
    const strFields = fields.filter((f) => fieldTypes[f] === "string");
    const numFields = fields.filter((f) => fieldTypes[f] === "number");

    setStringFields(strFields);
    setNumberFields(numFields);

    // Only set initial values if not already initialized
    if (!initialized && (!xField || !yField)) {
      setXField(config.xField || strFields[0] || fields[0] || "");
      setYField(config.yField || numFields[0] || fields[1] || "");
      setInitialized(true);
    }
  }, [fields, fieldTypes, config.xField, config.yField, initialized, xField, yField]);

  // Save fields to node config when they change
  useEffect(() => {
    if (!xField || !yField) return;
    
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                config: { ...(n.data?.config ?? {}), xField, yField },
              },
            }
          : n
      )
    );
  }, [xField, yField, nodeId, setNodes]);

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
      title="Bar Chart"
      typeLabel="Visualize"
      inputs={1}
      outputs={0}
      className="border-t-green-600"
    >
      {/* X-axis selector */}
      <div>
        <label className="block mb-1 text-gray-600">X-axis</label>
        <select
          value={xField}
          onChange={(e) => setXField(e.target.value)}
          className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-green-300"
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
          className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-green-300"
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
          <div className="flex justify-center mt-8 mb-4">
            <ChartContainer
              config={{ value: { label: "Value", color: "#4ade80" } }}
              className="w-full h-auto"
            >
              <BarChart width={120} height={120} data={chartData}>
                <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  label={{
                    value: xField,
                    position: "insideBottom",
                    offset: -5,
                  }}
                  tick={{ fontSize: 10 }}
                />
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
                <Bar data={chartData} dataKey="value" fill="#9f7aea" />
              </BarChart>
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
