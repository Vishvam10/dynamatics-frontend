import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { nodeColors } from "@/utils/node-colours";

interface BaseNodeProps {
  title: string;
  typeLabel: string;
  children?: React.ReactNode;
  inputs?: number;
  outputs?: number;
  className?: string;
}

export function BaseNode({
  title,
  typeLabel,
  children,
  inputs = 1,
  outputs = 1,
  className,
}: BaseNodeProps) {
  const color = nodeColors[typeLabel] || nodeColors.Default;

  return (
    <div
      className={cn(
        "relative rounded-md text-xs bg-white shadow-sm min-w-[150px] max-w-[200px]",
        className
      )}
      style={{
        borderTop: `4px solid ${color}`,
        // overflow: "visible", // 🟢 allow handles to stick out
      }}
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
      <div className="border-b px-2 py-1 bg-white flex flex-col justify-center">
        <span className="text-[8px] text-gray-400 uppercase tracking-wide">
          {typeLabel}
        </span>
        <span className="text-[12px] font-semibold text-gray-800 truncate">
          {title}
        </span>
      </div>

      {/* Content */}
      {children && (
        <div className="p-2 space-y-2 text-[10px] text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}
