import { diffDays, toDateInTimeZone } from "./utils";

/**
 * Returns a human-readable label for a date relative to now, respecting timezone.
 * @param isoString ISO date string
 * @param timeZone IANA timezone string
 * @param now Optional Date object (defaults to new Date())
 */
export function relativeDayLabel(
	isoString: string,
	timeZone: string,
	now: Date = new Date(),
): string {
	const date = new Date(isoString);

	const dateDay = toDateInTimeZone(date, timeZone);
	const nowDay = toDateInTimeZone(now, timeZone);

	const diffDaysValue = diffDays(dateDay, nowDay);

	if (diffDaysValue === 0) return "today";
	if (diffDaysValue === -1) return "yesterday";
	if (diffDaysValue === 1) return "tomorrow";

	return date.toLocaleString("en-US", {
		timeZone,
		dateStyle: "medium",
		timeStyle: "short",
	});
}
