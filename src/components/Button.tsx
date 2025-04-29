import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import styles from "./Button.module.scss";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = `${styles.button} inline-flex justify-center items-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200`;

    // Variant classes
    const variantClasses = {
      primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
      secondary:
        "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary",
      accent: "bg-accent text-white hover:bg-accent-dark focus:ring-accent",
      outline:
        "border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500",
      ghost:
        "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500",
    };

    // Size classes
    const sizeClasses = {
      small: "text-sm px-3 py-1",
      medium: "text-base px-4 py-2",
      large: "text-lg px-6 py-3",
    };

    // Width classes
    const widthClasses = fullWidth ? "w-full" : "";

    // Disabled classes
    const disabledClasses =
      disabled || isLoading
        ? "opacity-60 cursor-not-allowed pointer-events-none"
        : "";

    // Extract props safe for motion.button
    const { onAnimationStart, onDragStart, onDragEnd } = props;
    
    return (
      <motion.button
        ref={ref}
        // Only apply animations if button is not disabled or loading
        {...(!disabled && !isLoading
          ? {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
            }
          : {})}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`}
        disabled={disabled || isLoading}
        
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
