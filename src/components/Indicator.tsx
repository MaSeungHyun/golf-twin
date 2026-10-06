import type { ReactNode } from "react";
import { cn } from "../lib/style";

const colors = {
  blue: "bg-sky-500",
  white: "bg-white ring-1 ring-black/40",
  red: "bg-red-500",
} as const;

type IndicatorColor = keyof typeof colors;

export default function Indicator({
  color,
  children,
}: {
  color: IndicatorColor;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
      <span className={cn("size-3 shrink-0 rounded-full", colors[color])} />
      {children}
    </span>
  );
}
