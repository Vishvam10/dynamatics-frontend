import * as React from "react";
import { cn } from "@/lib/utils";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number; // Width of the border in pixels
  duration?: number; // Animation duration in seconds
  shineColor?: string | string[]; // Single or multiple colors
  borderRadius?: string | number; // Optional border-radius
  topOnly?: boolean; // Animate only the top border if true
}

/**
 * Shine Border
 *
 * Animated border effect component.
 */
export function ShineBorder({
  borderWidth = 2,
  duration = 14,
  shineColor = "#000000",
  borderRadius = "0.5rem",
  topOnly = true,
  className,
  style,
  ...props
}: ShineBorderProps) {
  const background = `radial-gradient(transparent, transparent, ${
    Array.isArray(shineColor) ? shineColor.join(",") : shineColor
  }, transparent, transparent)`;

  const mask = topOnly
    ? `linear-gradient(to bottom, #fffa 0 ${borderWidth}px, transparent ${borderWidth}px 100%)`
    : `linear-gradient(#fffa 0 0) content-box, linear-gradient(#fffa 0 0)`;

  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          backgroundImage: background,
          backgroundSize: "300% 300%",
          mask,
          WebkitMask: mask,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: `${borderWidth}px`,
          borderRadius,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "motion-safe:animate-shine pointer-events-none absolute inset-0 will-change-[background-position]",
        className
      )}
      {...props}
    />
  );
}
