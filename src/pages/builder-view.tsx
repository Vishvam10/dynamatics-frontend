import { BuilderCanvas } from "@/components/builder-canvas";
import { BuilderSidebar } from "@/components/builder-sidebar";
import { BuilderProvider } from "@/contexts/builder-context";
import { ReactFlowProvider } from "@xyflow/react";

export default function BuilderView() {
  return (
    <BuilderProvider>
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <BuilderSidebar />
        <div className="flex-1">
          <ReactFlowProvider>
            <BuilderCanvas />
          </ReactFlowProvider>
        </div>
      </div>
    </BuilderProvider>
  );
}
