import { type CSSProperties } from "react";

interface ShineCircleProps {
  size?: number; // diameter
  borderWidth?: number;
  duration?: number; // seconds
  colors?: string[];
}

export function ShineCircle({
  size = 12,
  duration = 12,
  colors = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
}: ShineCircleProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundImage: `linear-gradient(${colors.join(", ")})`,
    animation: `spin ${duration}s linear infinite`,
  };

  return <div style={style} />;
}
