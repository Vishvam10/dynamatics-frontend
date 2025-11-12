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

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
import { MergeNode } from "@/components/nodes/merge-node";

const nodeTypes = {
  filter: FilterNode,
  sort: SortNode,
  group: GroupNode,
  merge: MergeNode,
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
  const navigate = useNavigate();

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

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem("dynamatics-flow", JSON.stringify(flow));
      console.log("Flow saved:", flow);
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const savedFlow = localStorage.getItem("dynamatics-flow");
    if (!savedFlow) return;

    const flow = JSON.parse(savedFlow);
    const { x = 0, y = 0, zoom = 1 } = flow.viewport;

    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    reactFlowInstance.setViewport({ x, y, zoom });
  }, [reactFlowInstance]);

  const onClear = useCallback(() => {
    localStorage.removeItem("dynamatics-flow");
    setNodes([]);
    setEdges([]);
  }, []);

  return (
    <div className="relative h-full w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
        // Only allow one connection per input handle
        isValidConnection={(connection) => {
          return !edges.some(
            (e) =>
              e.target === connection.target &&
              e.targetHandle === connection.targetHandle
          );
        }}
      >
        <Background
          color="rgba(148, 0, 211, 0.15)"
          className="transition-colors duration-300 dark:bg-gray-900"
        />
        <Controls className="dark:bg-gray-800 dark:text-gray-100" />

        {/* 🔙 Back Button */}
        <Panel position="top-left">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Panel>

        {/* 💾 Save / Restore / Clear */}
        <Panel position="top-right" className="space-x-2">
          <Button
            size="sm"
            className="bg-violet-500 text-white hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700"
            onClick={onSave}
          >
            Save
          </Button>
          <Button
            size="sm"
            className="bg-violet-400 text-white hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-600"
            onClick={onRestore}
          >
            Restore
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            onClick={onClear}
          >
            Clear
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function BuilderView() {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <BuilderSidebar />
      <div className="flex-1">
        <ReactFlowProvider>
          <BuilderCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
