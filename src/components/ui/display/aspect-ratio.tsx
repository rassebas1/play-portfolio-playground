import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

/**
 * AspectRatio component.
 * A wrapper component that maintains a consistent aspect ratio for its content.
 * It extends `AspectRatioPrimitive.Root` from Radix UI.
 * @see https://www.radix-ui.com/docs/primitives/components/aspect-ratio
 *
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src="image.jpg" alt="Image" className="object-cover w-full h-full" />
 * </AspectRatio>
 */
const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
