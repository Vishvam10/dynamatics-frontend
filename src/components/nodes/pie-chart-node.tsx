import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

const COLORS = [
  "#9f7aea",
  "#6b46c1",
  "#d6bcfa",
  "#805ad5",
  "#b794f4",
  "#faf089",
];

export const PieChartNode = (props: NodeProps<BaseNodeData>) => {
  const builderCtx = useBuilder();
  const fields = Object.keys(builderCtx.nodeFieldsTypeMap || {});
  const { setNodes } = useReactFlow();

  const { id, data } = props;
  const config = data.config || {};

  const [yField, setYField] = useState(config.yField || "");
  const [chartData, setChartData] = useState<any[]>([]);
  const [initialized, setInitialized] = useState(false);

  const actualData = useMemo(
    () => data.executionData || [],
    [data.executionData]
  );

  // Initialize numeric field once
  useEffect(() => {
    if (!initialized && fields.length > 0) {
      setYField(config.yField || fields[0]);
      setInitialized(true);
    }
  }, [fields, config.yField, initialized]);

  // Sync yField to node config
  useEffect(() => {
    if (!yField) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                config: { ...(n.data?.config || {}), yField },
              },
            }
          : n
      )
    );
  }, [yField, id, setNodes]);

  // Map data for Pie chart
  useEffect(() => {
    if (!yField) return;
    const values = actualData.map((row: any) => row[yField] ?? 0);
    const total = values.reduce((acc: number, v: number) => acc + v, 0);

    const mapped = values.map((v: number, i: number) => ({
      name: (i + 1).toString(),
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
      {fields.length > 0 && (
        <div>
          <label className="block mb-1 text-gray-600 text-[10px]">Values</label>
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
      )}

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
