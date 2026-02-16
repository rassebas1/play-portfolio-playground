import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/**
 * AlertDialog component.
 * A wrapper component that provides context for an alert dialog.
 * It extends `AlertDialogPrimitive.Root` from Radix UI.
 * @see https://www.radix-ui.com/docs/primitives/components/alert-dialog
 */
const AlertDialog = AlertDialogPrimitive.Root

/**
 * AlertDialogTrigger component.
 * The element that opens the alert dialog when clicked.
 * It extends `AlertDialogPrimitive.Trigger` from Radix UI.
 */
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

/**
 * AlertDialogPortal component.
 * A portal that renders the alert dialog content outside the normal DOM hierarchy,
 * typically at the end of `document.body`, to ensure it's rendered above other content.
 * It extends `AlertDialogPrimitive.Portal` from Radix UI.
 */
const AlertDialogPortal = AlertDialogPrimitive.Portal

/**
 * AlertDialogOverlay component.
 * A semi-transparent overlay that appears behind the alert dialog,
 * preventing interaction with the rest of the page.
 * It extends `AlertDialogPrimitive.Overlay` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the overlay.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>} props - Additional props passed to the Radix UI AlertDialog.Overlay.
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

/**
 * AlertDialogContent component.
 * The main content area of the alert dialog, including its title, description, and actions.
 * It extends `AlertDialogPrimitive.Content` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the content wrapper.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>} props - Additional props passed to the Radix UI AlertDialog.Content.
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay /> {/* Renders the overlay behind the content */}
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

/**
 * AlertDialogHeader component.
 * A container for the title and description of the alert dialog.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 */
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

/**
 * AlertDialogFooter component.
 * A container for the action buttons of the alert dialog.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard HTML div attributes.
 */
const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

/**
 * AlertDialogTitle component.
 * The title of the alert dialog.
 * It extends `AlertDialogPrimitive.Title` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the title.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>} props - Additional props passed to the Radix UI AlertDialog.Title.
 */
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

/**
 * AlertDialogDescription component.
 * The descriptive text of the alert dialog.
 * It extends `AlertDialogPrimitive.Description` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the description.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>} props - Additional props passed to the Radix UI AlertDialog.Description.
 */
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

/**
 * AlertDialogAction component.
 * A button that performs the primary action of the alert dialog.
 * It extends `AlertDialogPrimitive.Action` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the action button.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>} props - Additional props passed to the Radix UI AlertDialog.Action.
 */
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)} // Applies default button styles.
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

/**
 * AlertDialogCancel component.
 * A button that cancels the action and closes the alert dialog.
 * It extends `AlertDialogPrimitive.Cancel` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the cancel button.
 * @param {React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>} props - Additional props passed to the Radix UI AlertDialog.Cancel.
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }), // Applies outline button styles.
      "mt-2 sm:mt-0", // Margin for mobile layout.
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
