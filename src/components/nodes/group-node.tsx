import { useState } from "react";
import { BaseNode } from "./base-node";

export const GroupNode = ({ data }: any) => {
  const { fields = [] } = data;
  const [selectedField, setSelectedField] = useState("");

  return (
    <BaseNode
      title="Group"
      typeLabel="Aggregate"
      // className="bg-white border-t-purple-500"
    >
      <select
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        className="w-full border border-gray-300 rounded p-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-300"
      >
        <option value="">Select field</option>
        {fields.map((f: string) => (
          <option key={f}>{f}</option>
        ))}
      </select>
    </BaseNode>
  );
};
