import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
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
  // Data Nodes
  ExampleDataNode,

  // Aggregate Nodes
  FilterNode,
  GroupNode,
  SortNode,

  // Logic Nodes
  LogicalAndNode,
  LogicalOrNode,

  // Machine Learning Nodes
  AnomalyDetectionNode,
  ForecastNode,

  // View Nodes
  ViewDataNode,

  // Chart Nodes
  BarChartNode,
  LineChartNode,
  AreaChartNode,
  PieChartNode,
} from "@/components/nodes";

import { MergeNode } from "@/components/nodes/merge-node";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuilder } from "@/contexts/builder-context";
import type { BaseNodeData } from "@/types/node-data";
import { sanitizeFlowGraph } from "@/utils/sanitize-flow-graph";

import wowGif from "@/assets/wow.gif";

interface Flow {
  flow_uid: string;
  flow_name: string;
  flow_graph: any;
}

export function BuilderCanvas() {
  const navigate = useNavigate();
  const { flow_uid } = useParams<{ flow_uid: string }>();
  const reactFlowInstance = useReactFlow();

  const { setNodeFieldsTypeMap, setExecutedFlowData, setFlowUid, flowUid } =
    useBuilder();

  const [canvasGifs, setCanvasGifs] = useState<
    { id: string; x: number; y: number }[]
  >([]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [_flowData, setFlowData] = useState<Flow | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [flowName, setFlowName] = useState("");

  // console.log("flowUid, flowName : ", flowUid, flowName);

  // -------------------------
  // Node Types
  // -------------------------
  const nodeTypes = useMemo(
    () => ({
      filter: FilterNode,
      sort: SortNode,
      group: GroupNode,
      merge: MergeNode,
      anomalyDetection: AnomalyDetectionNode,
      forecast: ForecastNode,
      logicalAnd: LogicalAndNode,
      logicalOr: LogicalOrNode,
      exampleData: ExampleDataNode,
      export: ViewDataNode,
      pieChart: PieChartNode,
      barChart: BarChartNode,
      lineChart: LineChartNode,
      areaChart: AreaChartNode,
    }),
    []
  );

  // -------------------------
  // Load Flow from API or create new flow_uid
  // -------------------------

  useEffect(() => {
    const initializeFlow = async () => {
      setLoading(true);

      try {
        let currentFlowUid = flow_uid;

        // If no flow_uid in URL, generate one
        if (!currentFlowUid) {
          currentFlowUid = `flow_${Date.now()}`;
          setFlowUid(currentFlowUid);
          setFlowData(null);
          setNodes([]);
          setEdges([]);
          return;
        }
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/flows/${currentFlowUid}`);

        if (!res.ok) {
          // Flow does not exist yet, create blank flow
          setFlowUid(currentFlowUid);
          setFlowData(null);
          setNodes([]);
          setEdges([]);
          return;
        }
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
        setFlowUid(data.data.flow_uid || "");

        if (reactFlowInstance && flowGraph.viewport) {
          const { x = 0, y = 0, zoom = 1 } = flowGraph.viewport;
          reactFlowInstance.setViewport({ x, y, zoom });
        }
      } catch (err) {
        console.warn("Failed to load flow, initializing blank builder", err);
        setFlowData(null);
        setNodes([]);
        setEdges([]);
        setFlowName(`unnamed_flow_${Date.now()}`);
        setFlowName(`flow_${Date.now()}`);
      } finally {
        setLoading(false);
      }
    };

    initializeFlow();
  }, [flow_uid]);

  const fetchAndUpdateNodeMetadata = useCallback(
    async (nodeId: string) => {
      if (!reactFlowInstance) return;

      // wait a tick to ensure config is updated
      await new Promise((r) => setTimeout(r, 0));

      const flow = reactFlowInstance.toObject();
      const cleanGraph = sanitizeFlowGraph(flow); // removes position/visual info

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

      try {
        const res = await fetch(`${apiUrl}/api/flows/metadata/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flow_graph: cleanGraph }),
        });

        if (!res.ok) throw new Error("Failed to fetch metadata");

        const metadata = await res.json();

        const typeMap: Record<string, string> = {
          str: "string",
          string: "string",
          number: "number",
          num: "number",
          int: "number",
          float: "number",
          bool: "boolean",
          boolean: "boolean",
          list: "list",
          array: "list",
          dict: "dict",
          date: "date",
          datetime: "date",
        };

        metadata.data.forEach((node: any) => {
          if (node.node_id === nodeId) {
            const allowedFields = node.allowed_fields || {};
            const nodeFieldTypes: Record<string, string> = {};
            Object.keys(allowedFields).forEach((field) => {
              const apiType = (allowedFields[field] || "str").toLowerCase();
              nodeFieldTypes[field] = typeMap[apiType] || "string";
            });

            // Update node metadata
            setNodes((nds) =>
              nds.map((n) =>
                n.id === nodeId
                  ? { ...n, data: { ...n.data, metadata: allowedFields } }
                  : n
              )
            );

            // Update builder's field map
            setNodeFieldsTypeMap((prev: any) => ({
              ...prev,
              [nodeId]: nodeFieldTypes,
            }));
          }
        });
      } catch (err) {
        console.error("Error fetching metadata for node:", nodeId, err);
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, metadata: {} } } : n
          )
        );
        setNodeFieldsTypeMap((prev: any) => ({ ...prev, [nodeId]: {} }));
      }
    },
    [reactFlowInstance, setNodes, setNodeFieldsTypeMap]
  );

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
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      // Fetch metadata for target node of the connection
      fetchAndUpdateNodeMetadata(connection.target);
    },
    [setEdges, fetchAndUpdateNodeMetadata]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowInstance) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeId = `${type}-${Date.now()}`;
      const data: BaseNodeData["data"] = {
        nodeId,
        config: type === "filter" ? { rules: [] } : {},
        metadata: {},
        executionData: null,
      };

      const node: Node<BaseNodeData["data"]> = {
        id: nodeId,
        type,
        position,
        data,
      };

      setNodes((nds) => [...nds, node]);
      // If Machine Learning node, show wow.gif at drop location
      if (type === "anomalyDetection" || type === "forecast") {
        setCanvasGifs((prev) => [
          ...prev,
          { id: `gif-${nodeId}`, x: event.clientX - 280, y: event.clientY },
        ]);

        // Optional: remove GIF after 3s
        setTimeout(() => {
          setCanvasGifs((prev) => prev.filter((g) => g.id !== `gif-${nodeId}`));
        }, 2000);
      }

      // Fetch metadata for the newly dropped node
      fetchAndUpdateNodeMetadata(nodeId);
    },
    [reactFlowInstance, setNodes, fetchAndUpdateNodeMetadata]
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
          flow_uid: flowUid || `flow_${Date.now()}`,
          flow_name: flowName,
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
  }, [setExecutedFlowData]);

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
      if (result.status === "success") {
        setExecutedFlowData(result.data);

        // --- Update nodes with executionData ---
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: { ...n.data, executionData: result.data },
          }))
        );
      }
    } catch (err) {
      console.error("Failed to run flow:", err);
    }
  }, [reactFlowInstance, flowName, setExecutedFlowData, setNodes]);

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
        // zoomOnScroll={false}
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

        {/* Easter egg */}
        {canvasGifs.map((gif) => (
          <img
            key={gif.id}
            src={wowGif}
            alt="Wow!"
            className="absolute w-12 h-12 pointer-events-none animate-bounce"
            style={{
              top: gif.y,
              left: gif.x,
              height: "8rem",
              width: "8rem",
            }}
          />
        ))}

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
