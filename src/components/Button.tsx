import { Slot } from "radix-ui";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/style";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "rail";
  active?: boolean;
  icon?: ReactNode;
};

const variants = {
  solid: "bg-white text-black hover:bg-white/90",
  outline:
    "border border-white/10 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15",
  ghost: "bg-transparent text-white hover:bg-white/10",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  rail: "w-[4.6rem] flex-col gap-1.5 rounded-2xl px-2 py-3 text-[11px] leading-none backdrop-blur-md",
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
    "inline-flex items-center justify-center rounded-md font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    active &&
      "border-[#3ddc97]/70 bg-[#10261c] text-[#5dffb1] shadow-[0_0_18px_rgba(61,220,151,0.18)] hover:bg-[#10261c]",
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
