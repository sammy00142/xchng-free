import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 animate-appear-in",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow text-white font-semibold duration-300 dark:hover:text-neutral-300 hover:ring-pink-400/20 dark:hover:ring-pink-400/20 duration-300 ring-4 ring-transparent",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 duration-300",
        outline:
          "border border-input bg-transparent shadow-sm ring-4 ring-transparent duration-200 hover:text-neutral-500 hover:ring-pink-100 dark:hover:text-neutral-300 dark:hover:ring-pink-400/10 duration-300",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm duration-300 shadow-[#E1BCDD] dark:shadow-pink-950 hover:ring-pink-100 dark:hover:ring-pink-400/20 duration-300 ring-4 ring-transparent",
        ghost:
          "hover:bg-accent hover:text-accent-foreground duration-300 hover:ring-pink-100 dark:hover:ring-pink-400/20 duration-300 ring-4 ring-transparent",
        link: "text-primary underline-offset-4 hover:underline duration-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
