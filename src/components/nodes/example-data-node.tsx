import { useState, useEffect, useCallback } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";
import { useFieldTypes } from "@/contexts/FieldTypesContext";

export const ExampleDataNode = ({ id, config }: any) => {
  const { setNodes } = useReactFlow();
  const { setFields, setFieldTypes, resetToDefaults } = useFieldTypes();
  const [dataset, setDataset] = useState(config?.input || "");

  // Fetch metadata and update global context
  const fetchDatasetMetadata = useCallback(async (dataset: string) => {
    if (!dataset) {
      resetToDefaults();
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/flows/metadata/${dataset}`);
      if (!res.ok) {
        console.warn(`Failed to fetch metadata for ${dataset}`);
        resetToDefaults();
        return;
      }

      const data = await res.json();
      const columnNames = Object.keys(data);
      
      // Map API column types to frontend field types
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

      const fieldTypesObj: Record<string, string> = {};
      columnNames.forEach((col: string) => {
        const apiType = (data[col] || "str").toLowerCase();
        fieldTypesObj[col] = typeMap[apiType] || "string";
      });

      setFields(columnNames);
      setFieldTypes(fieldTypesObj);
    } catch (err) {
      console.error(`Error fetching metadata for ${dataset}:`, err);
      resetToDefaults();
    }
  }, [setFields, setFieldTypes, resetToDefaults]);

  // Update node config whenever dataset changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              config: { ...(n.data?.config || {}), input: dataset },
              data: {
                ...(n.data || {}),
                
              },
            }
          : n
      )
    );

    fetchDatasetMetadata(dataset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, id]);

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
        <option value="test">Test</option>
      </select>
    </BaseNode>
  );
};
