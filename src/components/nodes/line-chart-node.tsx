import { useState, useEffect, useMemo } from "react";
import { BaseNode } from "./base-node";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";

export const LineChartNode = (props: NodeProps<BaseNodeData>) => {
  const builderCtx = useBuilder();
  const nodeFieldTypeMap = builderCtx.nodeFieldsTypeMap;
  const { setNodes } = useReactFlow();

  const { id, data } = props;
  const config = data.config || {};

  // Only use fields allowed for this node
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
    if (!yField && fields.length > 0) setYField(fields[0]);
  }, [fields, xField, yField]);

  // Sync xField/yField to node config
  useEffect(() => {
    if (!yField) return;
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
    if (!yField) return;
    const values = actualData.map((row: any) => row[yField] ?? 0);
    const total = values.reduce((acc: number, v: number) => acc + v, 0);

    const mapped = values.map((v: number, i: number) => ({
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
      showSaveButton={true}
      saveTooltipMessage={"Add to dashboard"}
      saveOnVisNodeType="line-chart"
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
      <div className="mt-1">
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
