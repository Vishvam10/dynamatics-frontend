import { useState, useMemo } from "react";
import { nodeColors } from "@/utils/node-colours";

const sidebarNodes = [
  {
    type: "filter",
    label: "Filter Node",
    category: "Transform",
    input: "Dataset",
    output: "Dataset",
  },
  {
    type: "sort",
    label: "Sort Node",
    category: "Transform",
    input: "Dataset",
    output: "Dataset",
  },
  {
    type: "group",
    label: "Group Node",
    category: "Aggregate",
    input: "Dataset",
    output: "Dataset",
  },
  {
    type: "dataSource",
    label: "Data Source",
    category: "Connector",
    input: "None",
    output: "Dataset",
  },
  {
    type: "exampleData",
    label: "Example Data",
    category: "Data",
    input: "None",
    output: "Dataset",
  },
  {
    type: "export",
    label: "Export Data",
    category: "Export",
    input: "Dataset",
    output: "None",
  },
  {
    type: "visualize",
    label: "Visualize",
    category: "Visualize",
    input: "Dataset",
    output: "None",
  },
];

const categories = ["All", "Data", "Transform", "Aggregate", "Connector"];

export function BuilderSidebar() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredNodes = useMemo(() => {
    return sidebarNodes.filter(
      (node) =>
        (filter === "All" || node.category === filter) &&
        node.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, filter]);

  const groupedNodes = useMemo(() => {
    const groups: Record<string, typeof sidebarNodes> = {};
    for (const node of filteredNodes) {
      if (!groups[node.category]) groups[node.category] = [];
      groups[node.category].push(node);
    }
    return groups;
  }, [filteredNodes]);

  return (
    <aside className="w-64 border-r bg-gray-50 flex flex-col h-full">
      {/* Header / Search / Filter */}
      <div className="p-3 border-b flex flex-col gap-2">
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          Nodes
        </h3>

        <input
          type="text"
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm rounded-md border px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm rounded-md border px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <div key={category}>
            <h4 className="text-[11px] uppercase font-semibold text-gray-500 mb-1 tracking-wide">
              {category}
            </h4>

            <div className="space-y-2">
              {nodes.map(({ type, label, input, output, category }) => {
                const color = nodeColors[category] || nodeColors.Default;
                return (
                  <div
                    key={type}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("application/reactflow", type)
                    }
                    className="cursor-grab select-none rounded-md border bg-white text-xs shadow-sm hover:shadow-md transition-all duration-150"
                  >
                    {/* Header */}
                    <div className="border-b px-2 py-1.5 flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex flex-col leading-tight">
                        {/* <span className="text-[10px] text-gray-400 uppercase">
                          {category}
                        </span> */}
                        <span className="text-[12px] font-medium text-gray-800">
                          {label}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-2 py-1 text-[11px] text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Input:</span>
                        <span className="font-medium text-gray-700">
                          {input}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Output:</span>
                        <span className="font-medium text-gray-700">
                          {output}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
