import { getLatestCheckpoint, mapCheckpointToStatus } from "@/lib/utils";
import type { Checkpoint } from "@/types/order";
import type { ComputedStatus } from "@/types/partials/constants";
import { STATUS_EXPLANATIONS, STATUS_LABELS } from "@/types/partials/constants";

export function computeStatus(checkpoints: Checkpoint[]): {
	code: ComputedStatus;
	label: string;
} {
	const latest = getLatestCheckpoint(checkpoints);
	if (!latest) return { code: "in_transit", label: STATUS_LABELS.in_transit };
	const code = mapCheckpointToStatus(latest.status || "");
	return { code, label: STATUS_LABELS[code] };
}

export function explainStatus(
	checkpoints: Checkpoint[],
	tz: string = "UTC",
): string {
	const latest = getLatestCheckpoint(checkpoints);
	if (!latest)
		return STATUS_EXPLANATIONS.in_transit(
			{
				status: "",
				status_details: "",
				event_timestamp: new Date().toISOString(),
				city: "",
				country_iso3: "",
			},
			tz,
		);

	const code = mapCheckpointToStatus(latest.status || "");
	return STATUS_EXPLANATIONS[code](latest, tz);
}

/**
 * Returns structured info for UI:
 * - computed status (code + label)
 * - explanation string
 * - nextAction string (if user needs to do something)
 */
export function getStatusWithExplanation(
	checkpoints: Checkpoint[],
	tz: string = "UTC",
) {
	const computed = computeStatus(checkpoints);
	const explanation = explainStatus(checkpoints, tz);

	let nextAction: string | null = null;
	switch (computed.code) {
		case "failed_attempt":
			nextAction = "Action required: Please follow carrier instructions.";
			break;
		case "ready_for_collection":
			nextAction = "Action required: Pick up your parcel.";
			break;
		default:
			nextAction = "No action required.";
	}

	return { computed, explanation, nextAction };
}
