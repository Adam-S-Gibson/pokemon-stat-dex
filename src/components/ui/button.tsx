import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "pixel-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "!bg-[var(--color-destructive)] !text-[var(--color-destructive-foreground)]",
        outline: "!bg-transparent",
        secondary: "!bg-[var(--color-gb-leaf)]",
        ghost:
          "!bg-transparent !border-transparent !shadow-none hover:!bg-[var(--color-gb-screen-light)]",
        link: "!border-transparent !shadow-none underline-offset-4 hover:underline",
      },
      size: {
        default: "px-3 py-2 text-[0.65rem]",
        sm: "px-2 py-1 text-[0.55rem]",
        lg: "px-4 py-3 text-[0.75rem]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
