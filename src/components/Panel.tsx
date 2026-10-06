import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/style";

type PanelProps = ComponentProps<"div"> & {
  asChild?: boolean;
};

export default function Panel({
  asChild = false,
  className,
  ...props
}: PanelProps) {
  const classes = cn(
    "rounded-2xl border border-white/10 bg-white/10 text-white shadow-lg backdrop-blur-md backdrop-brightness-50",
    className,
  );

  if (asChild) {
    return <Slot.Root className={classes} {...props} />;
  }

  return <div className={classes} {...props} />;
}
