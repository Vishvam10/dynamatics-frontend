import { useState, useEffect, useMemo } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, XAxis, YAxis, CartesianGrid, Area } from "recharts";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";
import { BaseNode } from "./base-node";

export const AreaChartNode = (props: NodeProps<BaseNodeData>) => {
  const builderCtx = useBuilder();
  const nodeFieldTypeMap = builderCtx.nodeFieldsTypeMap;
  const { setNodes } = useReactFlow();

  const { id, data } = props;
  const config = data.config || {};

  // Only use fields for this node
  const fields = Object.keys(nodeFieldTypeMap?.[id] || {});

  const [xField, setXField] = useState(config.xField || "");
  const [yField, setYField] = useState(config.yField || "");
  const [chartData, setChartData] = useState<any[]>([]);
  const [initialized, setInitialized] = useState(false);

  const actualData = useMemo(
    () => data.executionData || [],
    [data.executionData]
  );

  // Initialize fields only once
  useEffect(() => {
    if (!initialized && fields.length > 0) {
      setXField(config.xField || fields[0] || "");
      setYField(config.yField || fields[1] || fields[0] || "");
      setInitialized(true);
    }
  }, [fields, config.xField, config.yField, initialized]);

  // Save fields to node config when they change
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
      title="Area Chart"
      typeLabel="Visualize"
      inputs={1}
      outputs={0}
      className="border-t-purple-600"
      showSaveButton={true}
      saveTooltipMessage={"Add to dashboard"}
      saveOnVisNodeType="area-chart"
    >
      {/* X-axis selector */}
      {fields.length > 0 && (
        <div>
          <label className="block mb-1 text-gray-600 text-[10px]">X-axis</label>
          <select
            value={xField}
            onChange={(e) => setXField(e.target.value)}
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

      {/* Y-axis selector */}
      <div>
        <label className="block mb-1 text-gray-600 text-[10px]">Y-axis</label>
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

      {/* Area Chart */}
      {hasData ? (
        <div className="flex justify-center pt-2 w-80 h-48">
          <ChartContainer
            config={{ value: { label: "Value", color: "#9f7aea" } }}
            className="w-full h-full"
          >
            <AreaChart data={chartData}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#9f7aea"
                fill="#9f7aea"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </AreaChart>
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
