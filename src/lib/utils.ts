import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to conditionally join Tailwind CSS classes and merge them intelligently.
 * It combines the functionality of `clsx` (for conditional class application)
 * and `tailwind-merge` (for resolving Tailwind class conflicts).
 *
 * @param {...ClassValue[]} inputs - An array of class values. `ClassValue` can be a string,
 *                                   an object (where keys are class names and values are booleans),
 *                                   or an array of `ClassValue`s.
 * @returns {string} A single string containing merged and optimized Tailwind CSS classes.
 *
 * @example
 * // Basic usage
 * cn("text-red-500", "font-bold"); // => "text-red-500 font-bold"
 *
 * // Conditional classes
 * cn("p-4", isActive && "bg-blue-500"); // => "p-4 bg-blue-500" (if isActive is true)
 *
 * // Merging conflicting Tailwind classes
 * cn("p-4", "p-6"); // => "p-6" (tailwind-merge resolves to the last one)
 * cn("text-red-500", "text-blue-500"); // => "text-blue-500"
 *
 * // Combining all features
 * cn(
 *   "flex",
 *   "items-center",
 *   "justify-center",
 *   isActive ? "bg-green-500" : "bg-gray-200",
 *   "p-4",
 *   "px-6"
 * ); // => "flex items-center justify-center bg-green-500 px-6"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
