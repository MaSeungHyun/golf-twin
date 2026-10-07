import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "../lib/style";

type IconProps = LucideProps & {
  icon: LucideIcon;
};

export default function Icon({ icon: Glyph, className, ...props }: IconProps) {
  return (
    <Glyph
      aria-hidden
      className={cn("size-5 shrink-0", className)}
      {...props}
    />
  );
}
