import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("pixel-chip", {
  variants: {
    variant: {
      default: "",
      secondary: "!bg-[var(--color-gb-screen-light)]",
      destructive:
        "!bg-[var(--color-destructive)] !text-[var(--color-destructive-foreground)]",
      outline: "!bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
