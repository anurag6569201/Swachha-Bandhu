// src/components/ui/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500',
        secondary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500',
        outline: 'bg-transparent border border-teal-600 text-teal-600 hover:bg-teal-50',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        full: 'w-full px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, icon, iconPosition = 'left', children, ...props }, ref) => {
    const content = (
      <>
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </>
    );

    const buttonClasses = buttonVariants({ variant, size, className });

    const MotionWrapper = (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={size === 'full' ? 'w-full' : 'inline-block'}
        >
            {href ? (
              <Link to={href} className={buttonClasses}>
                {content}
              </Link>
            ) : (
              <button className={buttonClasses} ref={ref} {...props}>
                {content}
              </button>
            )}
        </motion.div>
    );

    return MotionWrapper;
  }
);

Button.displayName = 'Button';
export default Button;