import type { Checkpoint } from "@/types/order";

export const STATUS_CODES = [
	"delivered",
	"in_transit",
	"ready_for_collection",
	"failed_attempt",
	"delayed",
	"scheduled",
] as const;

export type ComputedStatus = (typeof STATUS_CODES)[number];

export const STATUS_LABELS: Record<ComputedStatus, string> = {
	delivered: "Delivered",
	in_transit: "In transit",
	ready_for_collection: "Ready for collection",
	failed_attempt: "Action required",
	delayed: "Delayed",
	scheduled: "Delivery scheduled",
};

export const STATUS_EXPLANATIONS: Record<
	ComputedStatus,
	(checkpoint: Checkpoint, tz?: string) => string
> = {
	delivered: (cp, tz = "UTC") =>
		`Delivered. Last confirmation received on ${new Date(
			cp.event_timestamp,
		).toLocaleString("en-US", {
			timeZone: tz,
			hour: "2-digit",
			minute: "2-digit",
			weekday: "short",
		})}.`,
	in_transit: (cp, tz = "UTC") =>
		`Your parcel is moving through the network. Last scan was on ${new Date(
			cp.event_timestamp,
		).toLocaleString("en-US", {
			timeZone: tz,
			hour: "2-digit",
			minute: "2-digit",
			weekday: "short",
		})}.`,
	ready_for_collection: (cp, tz = "UTC") =>
		`Your parcel is ready for pickup. Last update was on ${new Date(
			cp.event_timestamp,
		).toLocaleString("en-US", {
			timeZone: tz,
			hour: "2-digit",
			minute: "2-digit",
			weekday: "short",
		})}.`,
	failed_attempt: (cp, tz = "UTC") =>
		`Delivery attempt failed at ${new Date(cp.event_timestamp).toLocaleString(
			"en-US",
			{
				timeZone: tz,
				hour: "2-digit",
				minute: "2-digit",
				weekday: "short",
			},
		)}. Action required: follow carrier instructions.`,
	delayed: (cp, tz = "UTC") =>
		`Your parcel is delayed. We will update you with the next available delivery window.`,
	scheduled: (cp, tz = "UTC") =>
		`Your delivery has been scheduled. Last update was on ${new Date(
			cp.event_timestamp,
		).toLocaleString("en-US", {
			timeZone: tz,
			hour: "2-digit",
			minute: "2-digit",
			weekday: "short",
		})}.`,
};

export const STATUS_VARIANTS: Record<
	ComputedStatus,
	"default" | "destructive" | "outline"
> = {
	delivered: "default",
	in_transit: "outline",
	ready_for_collection: "outline",
	failed_attempt: "destructive",
	delayed: "outline",
	scheduled: "outline",
};
