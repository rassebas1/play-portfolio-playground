import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Avatar component.
 * A wrapper component that displays a user's profile picture or a fallback.
 * It extends `AvatarPrimitive.Root` from Radix UI.
 * @see https://www.radix-ui.com/docs/primitives/components/avatar
 * @param {string} [className] - Optional CSS class names to apply to the avatar container.
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>} props - Additional props passed to the Radix UI Avatar.Root.
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", // Base styles for the avatar container.
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

/**
 * AvatarImage component.
 * Displays the actual image within the Avatar.
 * It extends `AvatarPrimitive.Image` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the image.
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>} props - Additional props passed to the Radix UI Avatar.Image.
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)} // Styles to make the image fit and maintain aspect ratio.
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

/**
 * AvatarFallback component.
 * Displays a fallback (e.g., initials or a generic icon) when the AvatarImage fails to load.
 * It extends `AvatarPrimitive.Fallback` from Radix UI.
 * @param {string} [className] - Optional CSS class names to apply to the fallback.
 * @param {React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>} props - Additional props passed to the Radix UI Avatar.Fallback.
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted", // Styles for the fallback background and centering content.
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
