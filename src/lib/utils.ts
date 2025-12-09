import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { Checkpoint } from "@/types/order";
import type { ComputedStatus } from "@/types/partials/constants";
import { STATUS_CODES } from "@/types/partials/constants";

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

/**
 *  Helper to format date nicely in local timezone
 */
export function formatDateToLocal(dateString: string, tz: string = "UTC") {
	const d = new Date(dateString);
	return d.toLocaleString("en-US", {
		timeZone: tz,
		hour: "2-digit",
		minute: "2-digit",
		weekday: "short",
		month: "short",
		day: "numeric",
	});
}

/**
 *  Helper to normalize status strings
 */
export function normalizeStatus(status: string): ComputedStatus | null {
	const s = status.trim().toLowerCase().replace(/\s+/g, "_");
	return STATUS_CODES.includes(s as ComputedStatus)
		? (s as ComputedStatus)
		: null;
}

/**
 * Get the most recent checkpoint or null if none exist
 */
export function getLatestCheckpoint(
	checkpoints: Checkpoint[],
): Checkpoint | null {
	if (!checkpoints?.length) return null;
	const sorted = [...checkpoints].sort(
		(a, b) =>
			new Date(b.event_timestamp).getTime() -
			new Date(a.event_timestamp).getTime(),
	);
	return sorted[0] ?? null;
}

/**
 * Map human-readable checkpoint status to ComputedStatus
 */
export function mapCheckpointToStatus(status: string): ComputedStatus {
	const s = status.trim().toLowerCase();

	if (s.includes("failed") || s.includes("delivery attempt"))
		return "failed_attempt";
	if (s.includes("delivered")) return "delivered";
	if (s.includes("ready for pickup") || s.includes("ready for collection"))
		return "ready_for_collection";
	if (s.includes("delayed") || s.includes("weather")) return "delayed";
	if (s.includes("scheduled") || s.includes("new delivery date"))
		return "scheduled";

	return "in_transit";
}
