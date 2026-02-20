// Utility functions for the app

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine and merge Tailwind CSS classes
 * Handles conditional classes and resolves conflicts
 *
 * @example
 * cn('bg-red-500', 'text-white') // => 'bg-red-500 text-white'
 * cn('bg-red-500', { 'bg-blue-500': isBlue }) // => 'bg-blue-500' if isBlue
 * cn('p-4', props.className) // props.className can override p-4
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
