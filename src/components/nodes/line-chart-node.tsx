import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { useFieldTypes } from "@/contexts/FieldTypesContext";
import { useReactFlow } from "@xyflow/react";

interface LineChartNodeProps {
  nodeId: string;
  executedData?: any[];
  config?: { xField?: string; yField?: string };
}

export const LineChartNode = ({
  nodeId,
  executedData = [],
  config = {},
}: LineChartNodeProps) => {
  const { fields, fieldTypes } = useFieldTypes();
  const { setNodes } = useReactFlow();
  const [xField, setXField] = useState(config.xField || ""); // optional categorical
  const [yField, setYField] = useState(config.yField || ""); // numeric values
  const [chartData, setChartData] = useState<any[]>([]);
  const [stringFields, setStringFields] = useState<string[]>([]);
  const [numberFields, setNumberFields] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  const actualData = useMemo(() => {
    const nodeResult = executedData.find((d) => d.node_id === nodeId);
    return nodeResult?.output || [];
  }, [executedData, nodeId]);

  // infer fields from context
  useEffect(() => {
    const strFields = fields.filter((f) => fieldTypes[f] === "string");
    const numFields = fields.filter((f) => fieldTypes[f] === "number");

    setStringFields(strFields);
    setNumberFields(numFields);

    // Only set initial values if not already initialized
    if (!initialized && !yField) {
      setXField(config.xField || strFields[0] || ""); // optional
      setYField(config.yField || numFields[0] || "");
      setInitialized(true);
    }
  }, [fields, fieldTypes, config.xField, config.yField, initialized, yField]);

  // Save fields to node config when they change
  useEffect(() => {
    if (!yField) return;
    
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
