import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  FilterNode,
  GroupNode,
  ExampleDataNode,
  DataSourceNode,
  SortNode,
} from "./../components/nodes";
import { BuilderSidebar } from "@/components/builder-sidebar";
import { ExportDataNode } from "@/components/nodes/export-node";
import { PieChartNode } from "@/components/nodes/pie-chart-node";
import { BarChartNode } from "@/components/nodes/bar-chart-node";
import { LineChartNode } from "@/components/nodes/line-chart-node";
import { AreaChartNode } from "@/components/nodes/area-chart-node";

const flowKey = "dynamatics-flow";

const nodeTypes = {
  filter: FilterNode,
  sort: SortNode,
  group: GroupNode,
  exampleData: ExampleDataNode,
  dataSource: DataSourceNode,
  export: ExportDataNode,
  pieChart: PieChartNode,
  barChart: BarChartNode,
  lineChart: LineChartNode,
  areaChart: AreaChartNode,
};

const fields = ["id", "name", "age", "country"];
const fieldTypes = {
  id: "number",
  name: "string",
  age: "number",
  country: "string",
} as const;

function BuilderCanvas() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlowInstance = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const bounds = event.currentTarget.getBoundingClientRect();

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      let data: any = { fields };

      switch (type) {
        case "filter":
        case "sort":
        case "group":
          data = { fields, fieldTypes };
          break;
        case "export":
          data = { type: "data" };
          break;
        default:
          data = { fields };
      }

      const node: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data,
      };

      setNodes((nds) => nds.concat(node));
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      fitView
    >
      <Background />
      <Controls />

      {/* Panel for Save/Restore */}
      <Panel position="top-right" className="space-x-2">
        <button
          className="px-3 py-1 text-xs rounded bg-violet-500 text-white hover:bg-violet-600"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="px-3 py-1 text-xs rounded bg-violet-400 text-white hover:bg-violet-500"
          onClick={onRestore}
        >
          Restore
        </button>
        <button
          className="px-3 py-1 text-xs rounded bg-violet-300 text-gray-800 hover:bg-violet-400"
          onClick={onClear}
        >
          Clear
        </button>
      </Panel>
    </ReactFlow>
  );
}

export default function BuilderView() {
  return (
    <div className="flex h-screen w-full">
      <BuilderSidebar />
      <div className="flex-1">
        <ReactFlowProvider>
          <BuilderCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
