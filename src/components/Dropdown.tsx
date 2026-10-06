import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu as DropdownPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/style";
import Panel from "./Panel";

export const Dropdown = DropdownPrimitive.Root;
export const DropdownTrigger = DropdownPrimitive.Trigger;

export function DropdownContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <Panel asChild className={cn("z-50 min-w-40 p-1 outline-none", className)}>
        <DropdownPrimitive.Content sideOffset={sideOffset} {...props} />
      </Panel>
    </DropdownPrimitive.Portal>
  );
}

export function DropdownItem({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Item>) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center rounded px-3 py-2 text-md outline-none select-none data-highlighted:bg-white/10 data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export const DropdownSub = DropdownPrimitive.Sub;
export const DropdownRadioGroup = DropdownPrimitive.RadioGroup;

export function DropdownSubTrigger({
  className,
  children,
  chevron = "right",
  ...props
}: ComponentProps<typeof DropdownPrimitive.SubTrigger> & {
  chevron?: "left" | "right";
}) {
  const Chevron = chevron === "left" ? ChevronLeft : ChevronRight;

  return (
    <DropdownPrimitive.SubTrigger
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded px-3 py-2 text-md outline-none select-none data-highlighted:bg-white/10 data-[state=open]:bg-white/10",
        className,
      )}
      {...props}
    >
      {chevron === "left" ? <Chevron className="size-5 text-white/60" /> : null}
      <span className={cn(chevron === "left" && "ml-auto")}>{children}</span>
      {chevron === "right" ? <Chevron className="size-5 text-white/60" /> : null}
    </DropdownPrimitive.SubTrigger>
  );
}

export function DropdownSubContent({
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof DropdownPrimitive.SubContent>) {
  return (
    <DropdownPrimitive.Portal>
      <Panel asChild className={cn("z-50 min-w-36 p-1", className)}>
        <DropdownPrimitive.SubContent sideOffset={sideOffset} {...props} />
      </Panel>
    </DropdownPrimitive.Portal>
  );
}

export function DropdownRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownPrimitive.RadioItem>) {
  return (
    <DropdownPrimitive.RadioItem
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-md outline-none select-none data-highlighted:bg-white/10",
        className,
      )}
      {...props}
    >
      <span className="flex-1">{children}</span>
      <DropdownPrimitive.ItemIndicator>
        <Check className="size-5 text-[#5dffb1]" />
      </DropdownPrimitive.ItemIndicator>
    </DropdownPrimitive.RadioItem>
  );
}

export function DropdownSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Separator>) {
  return (
    <DropdownPrimitive.Separator
      className={cn("my-1 h-px bg-white/15", className)}
      {...props}
    />
  );
}
