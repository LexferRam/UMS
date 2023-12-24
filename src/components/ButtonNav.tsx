import React, { ButtonHTMLAttributes, ComponentProps, FC, ReactNode, forwardRef } from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { Button } from '@material-tailwind/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const buttonVariants = cva(
    "hover:bg-blue-50 hover:text-blue-800 rounded-md shadow-none text-sm font-medium text-muted-foreground",
    {
        variants: {
            variant: {
                default: "bg-white",
                active: "bg-blue-50 text-blue-800"
            },
            size: {
                default: "px-4 py-4",
                small: "h-9 py-2 rounded-md",
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

interface ButtonNavProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    href: string,
    iconComponent?: ReactNode,
    buttonTitle: string
}

export const ButtonNav: FC<ButtonNavProps> = forwardRef<HTMLButtonElement, ButtonNavProps>(({
    className,
    size,
    variant,
    href,
    iconComponent,
    buttonTitle,
    ...props
}, ref) => {
    return (
        <div className='grid grid-flow-row auto-rows-max text-sm mb-4'>
            <Button
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))} {...props}
            >
                <Link href={href}>
                    <div className="flex items-center gap-4">
                        {iconComponent}
                        <span>
                            {buttonTitle}
                        </span>
                    </div>
                </Link>
            </Button>
        </div>
    )
})

export default { buttonVariants };
