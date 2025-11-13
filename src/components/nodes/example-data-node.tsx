import { useState, useEffect, useCallback } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import type { BaseNodeData } from "@/types/node-data";
import { useBuilder } from "@/contexts/builder-context";

interface ExampleDataNodeConfig {
  input?: string;
}

export const ExampleDataNode = (props: NodeProps<BaseNodeData>) => {
  const { id, data } = props;
  const reactFlowInstance = useReactFlow();
  const { setNodes } = useReactFlow();
  const { setNodeFieldsTypeMap } = useBuilder();

  const config: ExampleDataNodeConfig = data?.config ?? {};
  const [dataset, setDataset] = useState(config.input || "");

  // We want to refresh the allowed fields on dataset change as well
  const fetchDatasetMetadata = useCallback(
    async (dataset: string) => {
      if (!dataset) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, metadata: {} } } : n
          )
        );
        setNodeFieldsTypeMap((prev: any) => ({ ...prev, [id]: {} }));
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        if (!reactFlowInstance) return;

        const flow = reactFlowInstance.toObject();

        const res = await fetch(`${apiUrl}/api/flows/metadata/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flow_graph: flow }),
        });

        if (!res.ok) {
          console.warn(`Failed to fetch metadata for ${dataset}`);
          setNodes((nds) =>
            nds.map((n) =>
              n.id === id ? { ...n, data: { ...n.data, metadata: {} } } : n
            )
          );
          setNodeFieldsTypeMap((prev: any) => ({ ...prev, [id]: {} }));
          return;
        }

        const metadata = await res.json();
        console.log("metadata:", metadata);

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

        const newNodeFieldsTypeMap: Record<string, Record<string, string>> = {};

        metadata.data.forEach((node: any) => {
          console.log("debug : ", node);
          const allowedFields = node.allowed_fields || {};
          const nodeFieldTypes: Record<string, string> = {};

          Object.keys(allowedFields).forEach((field) => {
            const apiType = (allowedFields[field] || "str").toLowerCase();
            nodeFieldTypes[field] = typeMap[apiType] || "string";
          });

          newNodeFieldsTypeMap[node.node_id] = nodeFieldTypes;

          // Update metadata for this node specifically
          if (node.node_id === id) {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === id
                  ? { ...n, data: { ...n.data, metadata: allowedFields } }
                  : n
              )
            );
          }
        });

        setNodeFieldsTypeMap((prev: any) => ({
          ...prev,
          ...newNodeFieldsTypeMap,
        }));
      } catch (err) {
        console.error(`Error fetching metadata for ${dataset}:`, err);
        setNodes((nds) =>
          nds.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, metadata: {} } } : n
          )
        );
        setNodeFieldsTypeMap((prev: any) => ({ ...prev, [id]: {} }));
      }
    },
    [id, setNodes, setNodeFieldsTypeMap, reactFlowInstance]
  );

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              config: { ...(n.data?.config ?? {}), input: dataset },
              data: {
                ...n.data,
              },
            }
          : n
      )
    );

    fetchDatasetMetadata(dataset);
  }, [dataset, id, fetchDatasetMetadata, setNodes]);

  return (
    <BaseNode
      title="Dataset"
      typeLabel="Data Source"
      className="border-t-purple-100"
      inputs={0}
    >
      <select
        className="w-full border rounded p-1 text-sm"
        value={dataset}
        onChange={(e) => setDataset(e.target.value)}
      >
        <option value="">Select dataset...</option>
        <option value="brandkit">Brandkit</option>
        <option value="automate">Automate</option>
        <option value="launch">Launch</option>
        <option value="cms">CMS</option>
        <option value="test">Test</option>
      </select>
    </BaseNode>
  );
};
