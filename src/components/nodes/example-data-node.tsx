import { useState } from "react";
import { BaseNode } from "./base-node";

export const ExampleDataNode = () => {
  const [dataset, setDataset] = useState("");

  return (
    <BaseNode
      title="Example Data"
      typeLabel="Data Source"
      className="border-t-purple-100"
      inputs={0}
    >
      <select
        className="w-full border rounded p-1 text-sm"
        value={dataset}
        onChange={(e) => setDataset(e.target.value)}
      >
        <option value="">Select dataset</option>
        <option value="sales">Sales Data</option>
        <option value="users">User Profiles</option>
        <option value="inventory">Inventory</option>
      </select>
    </BaseNode>
  );
};
