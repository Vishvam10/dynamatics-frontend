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
  const { executedFlowData, nodeFieldsTypeMap } = useBuilder();
  const { setNodes } = useReactFlow();

  const { id, data } = props;
  const config = data.config || {};

  // Only fields allowed for this node
  const fields = Object.keys(nodeFieldsTypeMap?.[id] || {});

  const [xField, setXField] = useState(config.xField || "");
  const [yField, setYField] = useState(config.yField || "");
  const [chartData, setChartData] = useState<any[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Use executed data from builder
  const actualData = useMemo(
    () => executedFlowData?.find((d) => d.node_id === id)?.output || [],
    [executedFlowData, id]
  );

  // Initialize default fields once
  useEffect(() => {
    if (!initialized && fields.length > 0) {
      setXField(config.xField || fields[0] || "");
      setYField(config.yField || fields[1] || fields[0] || "");
      setInitialized(true);
    }
  }, [fields, config.xField, config.yField, initialized]);

  // Sync xField/yField to node config
  useEffect(() => {
    if (!xField || !yField) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              config: { ...(n.data?.config || {}), xField, yField },
              data: {
                ...n.data,
              },
            }
          : n
      )
    );
  }, [xField, yField, id, setNodes]);

  // Map data for chart
  useEffect(() => {
    if (!xField || !yField) return;

    const mapped = actualData.map((row: any, i: number) => ({
      name: row[xField] ?? `Item ${i + 1}`,
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
      showSaveButton
      saveTooltipMessage="Add to dashboard"
      saveOnVisNodeType="bar-chart"
      saveOnVisNodeId={id}
      saveFields={{
        xField,
        yField,
      }}
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
