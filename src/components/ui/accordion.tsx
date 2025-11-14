import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Accordion component.
 * A wrapper component that provides context for a collection of collapsible content sections.
 * It extends `AccordionPrimitive.Root` from Radix UI.
 * @see https://www.radix-ui.com/docs/primitives/components/accordion
 */
const Accordion = AccordionPrimitive.Root

/**
 * AccordionItem component.
 * Represents a single collapsible item within the Accordion.
 * It extends `AccordionPrimitive.Item` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the item.
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>} props - Additional props passed to the Radix UI Accordion.Item.
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)} // Applies a bottom border and any custom classes.
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

/**
 * AccordionTrigger component.
 * The interactive element that toggles the visibility of an AccordionContent.
 * It extends `AccordionPrimitive.Trigger` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the trigger.
 * @param {React.ReactNode} children - The content to be rendered inside the trigger.
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>} props - Additional props passed to the Radix UI Accordion.Trigger.
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      {/* Chevron icon that rotates when the accordion item is open. */}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/**
 * AccordionContent component.
 * The collapsible content section associated with an AccordionTrigger.
 * It extends `AccordionPrimitive.Content` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the content wrapper.
 * @param {React.ReactNode} children - The content to be rendered inside the collapsible section.
 * @param {React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>} props - Additional props passed to the Radix UI Accordion.Content.
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
