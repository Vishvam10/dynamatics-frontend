import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

export const BarChartNode = (props: NodeProps<BaseNodeData>) => {
  const builderCtx = useBuilder();
  const nodeFieldTypeMap = builderCtx.nodeFieldsTypeMap;
  const { setNodes } = useReactFlow();

  const { id, data } = props;
  const config = data.config || {};
  // Use only fields allowed for this node
  const fields = Object.keys(nodeFieldTypeMap?.[id] || {});

  const [xField, setXField] = useState(config.xField || "");
  const [yField, setYField] = useState(config.yField || "");
  const [chartData, setChartData] = useState<any[]>([]);

  const actualData = useMemo(
    () => data.executionData || [],
    [data.executionData]
  );

  // Initialize default fields if empty
  useEffect(() => {
    if (!xField && fields.length > 0) setXField(fields[0]);
    if (!yField && fields.length > 1) setYField(fields[1] || fields[0]);
  }, [fields, xField, yField]);

  // Sync xField/yField to node config
  useEffect(() => {
    if (!xField || !yField) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                config: { ...(n.data?.config || {}), xField, yField },
              },
            }
          : n
      )
    );
  }, [id, xField, yField, setNodes]);

  // Map data for chart
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
      {fields.length > 0 && (
        <div>
          <label className="block mb-1 text-gray-600 text-[10px]">X-axis</label>
          <select
            value={xField}
            onChange={(e) => setXField(e.target.value)}
            className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-green-300"
          >
            {fields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Y-axis selector */}
      <div className="mt-1">
        <label className="block mb-1 text-gray-600 text-[10px]">Y-axis</label>
        <select
          value={yField}
          onChange={(e) => setYField(e.target.value)}
          className="w-full border rounded p-1 text-xs focus:ring-1 focus:ring-green-300"
        >
          {fields.map((f) => (
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
            config={{ value: { label: "Value", color: "#4ade80" } }}
            className="w-full h-full"
          >
            <BarChart width={300} height={150} data={chartData}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="value" fill="#9f7aea" />
            </BarChart>
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
