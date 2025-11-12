import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";

export const ExampleDataNode = ({ id, config, fetchFieldTypes }: any) => {
  const { setNodes } = useReactFlow();
  const [dataset, setDataset] = useState(config?.input || "");

  // Update node config whenever dataset changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...(n.data || {}),
                config: { ...(n.data?.config || {}), input: dataset },
              },
            }
          : n
      )
    );

    fetchFieldTypes(dataset);
  }, [dataset]);

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
