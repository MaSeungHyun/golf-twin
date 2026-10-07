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
  className,
}: {
  color: IndicatorColor;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3 tabular-nums")}>
      <span
        className={cn("size-3 shrink-0 rounded-full", colors[color], className)}
      />
      {children}
    </span>
  );
}
