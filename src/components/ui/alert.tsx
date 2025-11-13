import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Defines the base styles and variants for the Alert component using `cva`.
 * @see https://www.npmjs.com/package/class-variance-authority
 */
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground", // Default alert style.
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive", // Destructive alert style.
      },
    },
    defaultVariants: {
      variant: "default", // Default variant if none is specified.
    },
  }
)

/**
 * Alert component.
 * A customizable alert box for displaying important messages.
 * It supports different visual variants (e.g., default, destructive).
 * @param {string} [className] - Optional CSS class names to apply to the alert container.
 * @param {string} [variant] - The visual variant of the alert ('default' or 'destructive').
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Additional HTML div attributes.
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert" // ARIA role for accessibility.
    className={cn(alertVariants({ variant }), className)} // Combines base styles, variant styles, and custom classes.
    {...props}
  />
))
Alert.displayName = "Alert"

/**
 * AlertTitle component.
 * Used for the title of the Alert.
 * @param {string} [className] - Optional CSS class names to apply to the title.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Additional HTML heading attributes.
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

/**
 * AlertDescription component.
 * Used for the descriptive content of the Alert.
 * @param {string} [className] - Optional CSS class names to apply to the description.
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Additional HTML paragraph attributes.
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)} // Styles for text within the description.
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
