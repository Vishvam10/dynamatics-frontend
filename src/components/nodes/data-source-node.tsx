import { useState, useEffect } from "react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "@xyflow/react";

export const DataSourceNode = ({ id, config }: any) => {
  const { setNodes } = useReactFlow();
  const [mode, setMode] = useState<"url" | "upload">(config?.mode || "url");
  const [url, setUrl] = useState(config?.url || "");
  const [file, setFile] = useState<File | null>(config?.file || null);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, config: { mode, url, file } } : n))
    );
  }, [id, mode, url, file, setNodes]);

  return (
    <BaseNode
      title="Example Data"
      typeLabel="Data Source"
      className="border-t-purple-100"
      inputs={0}
    >
      <div className="flex gap-2">
        <button
          className={`flex-1 rounded border px-2 py-1 text-xs ${
            mode === "url" ? "bg-blue-100 border-blue-300" : ""
          }`}
          onClick={() => setMode("url")}
        >
          URL
        </button>
        <button
          className={`flex-1 rounded border px-2 py-1 text-xs ${
            mode === "upload" ? "bg-blue-100 border-blue-300" : ""
          }`}
          onClick={() => setMode("upload")}
        >
          Upload CSV
        </button>
      </div>

      {mode === "url" ? (
        <input
          className="w-full border rounded p-1 text-sm mt-2"
          placeholder="Enter data URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      ) : (
        <input
          className="w-full border rounded p-1 text-sm mt-2"
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      )}
    </BaseNode>
  );
};
