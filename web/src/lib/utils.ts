import { clsx, type ClassValue } from 'clsx';
import { notFound } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { ApiError } from '@/api/requests';

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

/**
 * Handles a not found response by throwing an error or calling the notFound function.
 * @param response - The response to handle.
 * @returns The response.
 * @throws An error if the response is not found.
 */
export async function handleNotFoundResponse<T>(response: Promise<T>): Promise<T> {
  try {
    return await response;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
