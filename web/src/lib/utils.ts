import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate the percentage change between two numbers.
 *
 * @param n1 - The first number.
 * @param n2 - The second number.
 * @returns The percentage change between n1 and n2 as a string.
 */
export function calculatePercentageChange(n1: number, n2: number): string {
  const percentage: number = ((n2 - n1) / n1) * 100;
  return percentage >= 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
}
