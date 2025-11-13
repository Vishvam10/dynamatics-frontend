import { Handle, Position, useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { nodeColors } from "@/utils/node-colours";
import { Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBuilder } from "@/contexts/builder-context";

interface BaseNodeProps {
  title: string;
  typeLabel: string;
  children?: React.ReactNode;
  inputs?: number;
  outputs?: number;
  className?: string;
  showSaveButton?: boolean;
  saveTooltipMessage?: string;
  saveOnVisNodeType?: string;
  saveOnVisNodeId?: string;
}

export function BaseNode({
  title,
  typeLabel,
  children,
  inputs = 1,
  outputs = 1,
  className,
  showSaveButton = false,
  saveTooltipMessage = "Save changes",
  saveOnVisNodeType = "",
  saveOnVisNodeId = "",
}: BaseNodeProps) {
  const color = nodeColors[typeLabel] || nodeColors.Default;
  const { flowUid } = useBuilder();
  const reactFlowInstance = useReactFlow();

  const onSaveClick = async () => {
    console.log("REACHED : ", flowUid);
    if (!reactFlowInstance || !flowUid) return;

    const flow = reactFlowInstance.toObject();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const method = "POST";
      const url = `${apiUrl}/api/flows`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flow_uid: flowUid || `flow_${Date.now()}`,
          flow_graph: flow,
          vis_node_type: saveOnVisNodeType,
          vis_node_id: saveOnVisNodeId,
          render_in_dashboard: true,
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      console.log("Flow saved successfully!");
    } catch (err) {
      console.error("Failed to save flow : ", err);
    }
  };

  return (
    <div
      className={cn(
        "relative text-xs rounded-lg bg-white shadow-sm flex flex-col min-w-32 border border-gray-200",
        "h-auto",
        className
      )}
      style={{ borderTop: `4px solid ${color}` }}
    >
      {/* Input Handles */}
      {Array.from({ length: inputs }).map((_, i) => (
        <Handle
          key={`in-${i}`}
          type="target"
          position={Position.Left}
          id={`input-${i}`}
          style={{
            top: `${((i + 1) * 100) / (inputs + 1)}%`,
            left: "-10px",
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: color,
            border: "2px solid white",
            boxShadow: `0 0 4px ${color}`,
          }}
        />
      ))}

      {/* Output Handles */}
      {Array.from({ length: outputs }).map((_, i) => (
        <Handle
          key={`out-${i}`}
          type="source"
          position={Position.Right}
          id={`output-${i}`}
          style={{
            top: `${((i + 1) * 100) / (outputs + 1)}%`,
            right: "-10px",
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: color,
            border: "2px solid white",
            boxShadow: `0 0 4px ${color}`,
          }}
        />
      ))}

      {/* Header */}
      <div className="border-b px-2 py-1 bg-white shrink-0 flex items-center justify-between">
        <div>
          <span className="text-[8px] text-gray-400 uppercase tracking-wide block">
            {typeLabel}
          </span>
          <span className="text-[12px] font-semibold text-gray-800 truncate block">
            {title}
          </span>
        </div>

        {showSaveButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onSaveClick}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 transform transition duration-150 ease-in-out hover:scale-110 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Save className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{saveTooltipMessage}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Dynamic Content */}
      {children && (
        <div className="p-2 space-y-1.5 text-[10px] text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}
