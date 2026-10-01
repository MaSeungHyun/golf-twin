import { Slot } from "radix-ui";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/style";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md";
};

const variants = {
  solid: "bg-white text-black hover:bg-white/90",
  outline: "border border-white/30 bg-black/40 text-white hover:bg-white/15",
  ghost: "bg-transparent text-white hover:bg-white/10",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
} as const;

export default function Button({
  className,
  variant = "solid",
  size = "md",
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (asChild) {
    return <Slot.Root className={classes} {...props} />;
  }

  return <button type={type} className={classes} {...props} />;
}
