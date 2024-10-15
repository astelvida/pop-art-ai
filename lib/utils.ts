import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This function has been moved to server-utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
