import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: "bg-foreground text-background hover:opacity-90 shadow-premium",
                glow: "bg-primary text-primary-foreground shadow-glow-primary hover:scale-[1.02]",
                vercel: "bg-background text-foreground shadow-premium border border-border/40 hover:bg-accent active:scale-95",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg",
                outline:
                    "border border-border/40 bg-transparent hover:bg-accent hover:text-accent-foreground backdrop-blur-sm",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },

            size: {
                default: "h-11 px-6 py-2.5",
                sm: "h-9 px-4 text-xs",
                lg: "h-14 px-10 text-base",
                xl: "h-16 px-12 text-lg",
                icon: "h-11 w-11",
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
