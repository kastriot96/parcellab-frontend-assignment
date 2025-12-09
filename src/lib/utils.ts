import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple Tailwind class names into a single string, intelligently merging conflicts.
 * Accepts strings, arrays, objects (for conditional classes), and other clsx-compatible values.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Returns the difference in full days between two dates.
 */
export function diffDays(date1: Date, date2: Date): number {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	d1.setHours(0, 0, 0, 0);
	d2.setHours(0, 0, 0, 0);
	return Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Converts a date to a specific timezone, returning a Date object in that timezone.
 */
export function toDateInTimeZone(date: Date, timeZone: string): Date {
	return new Date(date.toLocaleString("en-US", { timeZone }));
}