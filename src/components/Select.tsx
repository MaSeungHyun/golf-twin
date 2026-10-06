import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/style";
import Panel from "./Panel";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "glass inline-flex h-10 items-center justify-between gap-2 rounded-md border border-white/10 px-4 text-md text-white backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="text-white/70">
        <svg className="size-4" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 6,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <Panel
        asChild
        className={cn(
          "z-50 max-h-64 min-w-(--radix-select-trigger-width) overflow-y-auto",
          className,
        )}
      >
        <SelectPrimitive.Content
          position={position}
          sideOffset={sideOffset}
          {...props}
        >
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </Panel>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center px-3 py-2 text-md outline-none select-none data-highlighted:bg-white/10 data-[state=checked]:bg-white/15 data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
