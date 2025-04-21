import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "w-full inline-flex items-center disabled:pointer-events-none  justify-center gap-2 whitespace-nowrap rounded-md text-14 font-SwitzerMedium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:bg-linear-gray disabled:text-second disabled:border-[1.5px] disabled:border-first disabled:border-b-[3.5px] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-first",
        yellow:
          "rounded-[2px] bg-linear-yellow hover:bg-hover-yellow text-first border-[1.5px] border-first hover:border-first border-b-[3.5px]",
        green:
          "rounded-[2px] bg-linear-green hover:bg-hover-green text-white border-[1.5px] border-first hover:border-first border-b-[3.5px]",
        red: "rounded-[2px] bg-linear-red hover:bg-hover-red text-white border-[1.5px] border-first hover:border-first border-b-[3.5px]",
        pink: "rounded-[2px] bg-linear-pink hover:bg-hover-pink text-white border-[1.5px] border-first hover:border-first border-b-[3.5px]",
        white:
          "rounded-[2px] bg-white hover:opacity-95 text-first border-[1.5px] border-first hover:border-first border-b-[3.5px]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        tradeDisabled:
          "disabled:!bg-gradient-to-b disabled:!from-[rgba(151,151,151,0.26)] disabled:!to-[#979797] disabled:!cursor-not-allowed",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <div className="flex items-center gap-1">
        <Comp
          className={cn(buttonVariants({ variant, size, className }), {
            "pointer-events-none": loading,
          })}
          ref={ref}
          {...props}
        >
          {loading ? <LoaderCircle className="animate-spin" /> : children}
        </Comp>
      </div>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
