/**
 * Utility Functions
 * 
 * @description Common utility functions used throughout the application.
 * Currently provides className merging for Tailwind CSS.
 * 
 * @functions
 * - cn(): Merges Tailwind CSS class names with clsx and tailwind-merge
 * 
 * @features
 * - Intelligent class name merging
 * - Tailwind conflict resolution
 * - Conditional class name support
 * - Type-safe class value handling
 * 
 * @usage
 * cn('px-2 py-1', condition && 'bg-blue-500', { 'font-bold': isActive })
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
