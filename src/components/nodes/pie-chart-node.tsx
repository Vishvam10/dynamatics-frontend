import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { useFieldTypes } from "@/contexts/FieldTypesContext";
import { useReactFlow } from "@xyflow/react";

const COLORS = [
  "#9f7aea",
  "#6b46c1",
  "#d6bcfa",
  "#805ad5",
  "#b794f4",
  "#faf089",
];

interface PieChartNodeProps {
  nodeId: string;
  executedData?: any[];
  config?: { yField?: string };
}

export const PieChartNode = ({
  nodeId,
  executedData = [],
  config = {},
}: PieChartNodeProps) => {
  const { fields, fieldTypes } = useFieldTypes();
  const { setNodes } = useReactFlow();
  const [yField, setYField] = useState(config.yField || "");
  const [chartData, setChartData] = useState<any[]>([]);
  const [numberFields, setNumberFields] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  const actualData = useMemo(() => {
    const nodeResult = executedData.find((d) => d.node_id === nodeId);
    return nodeResult?.output || [];
  }, [executedData, nodeId]);

  // Infer numeric fields from context and initialize yField only once
  useEffect(() => {
    // const numFields = fields.filter((f) => fieldTypes[f] === "number");
    // setNumberFields(numFields);
    
    // Only set initial value if not already initialized
    if (!initialized && !yField && fields.length > 0) {
      const initialField = config.yField || fields[0] || fields[0] || "";
      setYField(initialField);
      setInitialized(true);
    }
  }, [fields, fieldTypes, config.yField, initialized, yField]);

  // Save yField to node config when it changes
  useEffect(() => {
    if (!yField) return;
    
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              config: { yField },
              data: {
                ...n.data,
              },
            }
          : n
      )
    );
  }, [yField, nodeId, setNodes]);

  // Map chart data and convert to percentages
  useEffect(() => {
    if (!yField) return;

    const values = actualData.map((row: any) => row[yField] ?? 0);
    const total = values.reduce((acc: any, v: any) => acc + v, 0);

    const mapped = values.map((v: any, i: any) => ({
      name: (i + 1).toString(), // index as label
      value: total ? (v / total) * 100 : 0,
    }));

    setChartData(mapped);
  }, [actualData, yField]);

  const hasData = chartData.length > 0;

  return (
    <BaseNode
      title="Pie Chart"
      typeLabel="Visualize"
      inputs={1}
      outputs={0}
      className="border-t-purple-600"
    >
      {/* Y-axis selector */}
      <div>
        <label className="block mb-1 text-gray-600">Values</label>
        <select
          value={yField}
          onChange={(e) => setYField(e.target.value)}
          className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-purple-300"
        >
          {fields.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Pie Chart */}
      {hasData ? (
        <div className="flex justify-center pt-2 w-80 h-48">
          <ChartContainer
            config={{ value: { label: "Value (%)", color: "#9f7aea" } }}
            className="w-full h-full"
          >
            <PieChart width={300} height={150}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={50}
                fill="#9f7aea"
                label={(entry) => `${entry.value.toFixed(1)}%`}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            </PieChart>
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
