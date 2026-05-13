/**
 * Input Component
 *
 * @description Reusable form input component with consistent styling.
 * Extends native HTML input element with enhanced visual design.
 *
 * @features
 * - Consistent border and padding styling
 * - Focus ring for accessibility
 * - File input support with custom styling
 * - Placeholder text styling
 * - Disabled state styling
 * - Forward ref support for form libraries
 *
 * @props
 * Extends all standard HTML input attributes
 * - type: Input type (text, email, password, number, etc.)
 * - className: Additional CSS classes
 *
 * @usage
 * <Input type="text" placeholder="Enter your name" />
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
