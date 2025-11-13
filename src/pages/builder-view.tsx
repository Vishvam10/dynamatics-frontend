import { useState, useCallback, useEffect, useMemo } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  FilterNode,
  GroupNode,
  ExampleDataNode,
  DataSourceNode,
  SortNode,
} from "@/components/nodes";
import { BuilderSidebar } from "@/components/builder-sidebar";
import { ExportDataNode } from "@/components/nodes/export-node";
import { PieChartNode } from "@/components/nodes/pie-chart-node";
import { BarChartNode } from "@/components/nodes/bar-chart-node";
import { LineChartNode } from "@/components/nodes/line-chart-node";
import { AreaChartNode } from "@/components/nodes/area-chart-node";
import { MergeNode } from "@/components/nodes/merge-node";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFieldTypes, FieldTypesProvider } from "@/contexts/FieldTypesContext";

interface Flow {
  flow_uid: string;
  flow_name: string;
  flow: any;
}

function BuilderCanvas() {
  const navigate = useNavigate();
  const { flow_uid } = useParams<{ flow_uid: string }>();
  const reactFlowInstance = useReactFlow();
  const { fields, fieldTypes } = useFieldTypes();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [flowData, setFlowData] = useState<Flow | null>(null);

  const [executedFlowData, setExecutedFlowData] = useState<any[]>([]);
  const [fieldTypesMap, setFieldTypesMap] = useState<Record<string, any>>({});

  const [loading, setLoading] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [flowName, setFlowName] = useState("");

  // -------------------------
  // Node Types
  // -------------------------
  const nodeTypes = useMemo(
    () => ({
      filter: FilterNode,
      sort: SortNode,
      group: GroupNode,
      merge: MergeNode,
      exampleData: ExampleDataNode,
      dataSource: DataSourceNode,
      export: (props: any) => (
        <ExportDataNode {...props} executedData={executedFlowData} />
      ),
      pieChart: (props: any) => (
        <PieChartNode
          {...props}
          executedData={executedFlowData}
          nodeId={props.id}
          config={props.data?.config || {}}
        />
      ),
      barChart: (props: any) => (
        <BarChartNode
          {...props}
          executedData={executedFlowData}
          nodeId={props.id}
          config={props.data?.config || {}}
        />
      ),
      lineChart: (props: any) => (
        <LineChartNode
          {...props}
          executedData={executedFlowData}
          nodeId={props.id}
          config={props.data?.config || {}}
        />
      ),
      areaChart: (props: any) => (
        <AreaChartNode
          {...props}
          executedData={executedFlowData}
          nodeId={props.id}
          config={props.data?.config || {}}
        />
      ),
    }),
    [executedFlowData]
  );

  // -------------------------
  // Load Flow from API
  // -------------------------
  useEffect(() => {
    const fetchFlow = async () => {
      setLoading(true);
      try {
        if (!flow_uid) return;

        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/flows/${flow_uid}`);
        if (!res.ok) throw new Error("Flow not found");

        const data = await res.json();
        const flowGraph = data.data.flow_graph;
        if (!flowGraph) throw new Error("Flow graph not found");

        setFlowData(flowGraph);
        const mappedNodes = flowGraph.nodes.map((n: any) => ({
          ...n,
          data: { ...n.data, config: n.config || {} },
        }));
        setNodes(mappedNodes);
        setEdges(flowGraph.edges || []);
        setFlowName(data.data.flow_name || "");

        if (reactFlowInstance && flowGraph.viewport) {
          const { x = 0, y = 0, zoom = 1 } = flowGraph.viewport;
          reactFlowInstance.setViewport({ x, y, zoom });
        }
      } catch (err) {
        console.warn("Flow not found, opening blank builder", err);
        setFlowData(null);
        setNodes([]);
        setEdges([]);
        setFlowName("");
      } finally {
        setLoading(false);
      }
    };
    fetchFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow_uid]);

  // -------------------------
  // Node / Edge Callbacks
  // -------------------------
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

      const data: any = ["filter", "sort", "group"].includes(type)
        ? { fields, fieldTypes }
        : { fields };

      const node: Node = { id: `${type}-${Date.now()}`, type, position, data };
      setNodes((nds) => [...nds, node]);
    },
    [reactFlowInstance, fields, fieldTypes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // -------------------------
  // Save Flow
  // -------------------------
  const openSaveModal = () => setIsSaveModalOpen(true);
  const closeSaveModal = () => setIsSaveModalOpen(false);

  const onSave = useCallback(async () => {
    if (!reactFlowInstance) return;

    const flow = reactFlowInstance.toObject();
    localStorage.setItem("dynamatics-flow", JSON.stringify(flow));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const method = flow_uid ? "PUT" : "POST";
      const url = flow_uid
        ? `${apiUrl}/api/flows/${flow_uid}`
        : `${apiUrl}/api/flows`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flow_name: flowName || `Flow-${Date.now()}`,
          flow_graph: flow,
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      if (!flow_uid && data.flow_uid)
        navigate(`/builder/${data.flow_uid}`, { replace: true });
    } catch (err) {
      console.error("Failed to save flow to API:", err);
    }

    closeSaveModal();
    setFlowName("");
  }, [flowName, reactFlowInstance, flow_uid, navigate]);

  const onClear = useCallback(() => {
    localStorage.removeItem("dynamatics-flow");
    setNodes([]);
    setEdges([]);
    setExecutedFlowData([]);
    setFieldTypesMap({});
  }, []);

  // -------------------------
  // Run full flow
  // -------------------------
  const onRunFullFlow = useCallback(async () => {
    if (!reactFlowInstance) return;

    const flow = reactFlowInstance.toObject();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/flows/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flow_name: flowName || "Unnamed Flow",
          flow_graph: flow,
        }),
      });
      if (!res.ok) throw new Error(`Execution failed: ${res.statusText}`);
      const result = await res.json();
      if (result.status === "success") setExecutedFlowData(result.data);
    } catch (err) {
      console.error("Failed to run flow:", err);
    }
  }, [reactFlowInstance, flowName]);

  if (loading) return <div>Loading...</div>;

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
        isValidConnection={(connection) =>
          !edges.some(
            (e) =>
              e.target === connection.target &&
              e.targetHandle === connection.targetHandle
          )
        }
      >
        <Background
          color="rgba(148, 0, 211, 0.15)"
          className="transition-colors duration-300 dark:bg-gray-900"
        />
        <Controls className="dark:bg-gray-800 dark:text-gray-100" />

        <Panel position="top-left">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Panel>

        <Panel position="top-right" className="space-x-2">
          <Button onClick={openSaveModal}>Save</Button>
          <Button onClick={onRunFullFlow}>Run</Button>
          <Button onClick={onClear}>Clear</Button>
        </Panel>
      </ReactFlow>

      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Flow</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Flow Name</label>
            <Input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Enter flow name"
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={closeSaveModal}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function BuilderView() {
  return (
    <FieldTypesProvider>
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <BuilderSidebar />
        <div className="flex-1">
          <ReactFlowProvider>
            <BuilderCanvas />
          </ReactFlowProvider>
        </div>
      </div>
    </FieldTypesProvider>
  );
}
