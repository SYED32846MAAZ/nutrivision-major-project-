import React from 'react'
import { cn } from '@/app/lib/utils'
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
    "relative group border text-foreground mx-auto text-center rounded-xl",
    {
        variants: {
            variant: {
                default: "bg-green-500/5 hover:bg-green-500/0 border-green-500/20 text-gray-800",
                solid: "bg-green-600 hover:bg-green-700 text-white border-transparent hover:border-foreground/50 transition-all duration-200",
                ghost: "border-transparent bg-transparent hover:border-zinc-400 hover:bg-black/5 text-gray-700",
                destructive: "bg-red-600 hover:bg-red-700 text-white border-transparent hover:border-red-400 transition-all duration-200 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]",
            },
            size: {
                default: "px-7 py-2.5",
                sm: "px-4 py-1.5 text-sm",
                lg: "px-10 py-3 text-lg font-bold",
                full: "w-full py-4 text-lg font-bold"
            },
        },
        defaultVariants: {
            variant: "solid",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { neon?: boolean }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, neon = true, size, variant, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), "overflow-hidden", className)}
                ref={ref}
                {...props}
            >
                {/* Top Border Glow */}
                <span className={cn("absolute h-px w-3/4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r mx-auto from-transparent", variant === 'destructive' ? "via-red-400" : "via-green-400", "to-transparent hidden", neon && "block")} />
                
                {/* Content wrapper so z-index stays above effects */}
                <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
                
                {/* Bottom Border Glow */}
                <span className={cn("absolute h-px w-3/4 opacity-30 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 -bottom-px bg-gradient-to-r mx-auto from-transparent", variant === 'destructive' ? "via-red-500" : "via-green-500", "to-transparent hidden", neon && "block")} />
                
                {/* Ambient Shadow Glow (Optional but premium) */}
                {neon && (
                    <span className={cn("absolute w-full h-full inset-0 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 bg-gradient-to-r from-transparent", variant === 'destructive' ? "via-red-500" : "via-green-500", "to-transparent pointer-events-none")} />
                )}
            </button>
        );
    }
)

Button.displayName = 'Button';

export { Button, buttonVariants };
