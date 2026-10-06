import { Slot } from "radix-ui";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/style";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "rail";
  active?: boolean;
  icon?: ReactNode;
};

const variants = {
  solid: "bg-primary text-secondary hover:bg-primary/90",
  outline:
    "glass border border-primary/10 text-primary backdrop-blur-md hover:bg-primary/15",
  ghost: "bg-transparent text-primary hover:bg-primary/10",
} as const;

const sizes = {
  sm: "h-10 px-4 text-md",
  md: "h-12 px-5 text-md",
  lg: "h-14 px-6 text-lg",
  rail: "w-28 flex-col gap-2 rounded-2xl px-3 py-4 text-sm leading-none backdrop-blur-md",
} as const;

export default function Button({
  className,
  variant = "solid",
  size = "md",
  active = false,
  icon,
  asChild = false,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    active &&
      "border-accent-strong/70 bg-accent-surface text-accent shadow-[0_0_18px_color-mix(in_srgb,var(--color-accent-strong)_18%,transparent)] hover:bg-accent-surface",
    className,
  );

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {icon}
      {children}
    </button>
  );
}
