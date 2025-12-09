import { describe, it, expect } from "vitest";
import { getStatusWithExplanation } from "@/lib/status";
import type { Checkpoint } from "@/types/order";

describe("Status Explainer", () => {
	const now = new Date().toISOString();
	const cp = (status: string): Checkpoint => ({
		status,
		status_details: "",
		event_timestamp: now,
	});

	it("delivered", () => {
		const cps = [cp("Delivered")];
		const { computed, explanation } = getStatusWithExplanation(cps);
		expect(computed.code).toBe("delivered");
		expect(explanation).toContain("Delivered");
	});

	it("failed attempt", () => {
		const cps = [cp("Failed delivery attempt")];
		const { computed, explanation } = getStatusWithExplanation(cps);
		expect(computed.code).toBe("failed_attempt");
		expect(explanation).toContain("Action required");
	});

	it("ready for collection", () => {
		const cps = [cp("Ready for collection")];
		const { computed, explanation } = getStatusWithExplanation(cps);
		expect(computed.code).toBe("ready_for_collection");
		expect(explanation).toContain("ready for pickup");
	});

	it("delayed", () => {
		const cps = [cp("Delayed due to weather")];
		const { computed, explanation } = getStatusWithExplanation(cps);
		expect(computed.code).toBe("delayed");
		expect(explanation).toContain("delayed");
	});

	it("scheduled", () => {
		const cps = [cp("New delivery date set")];
		const { computed, explanation } = getStatusWithExplanation(cps);
		expect(computed.code).toBe("scheduled");
		expect(explanation).toContain("scheduled");
	});

	it("in transit fallback", () => {
		const cps = [cp("Processed at facility")];
		const { computed, explanation } = getStatusWithExplanation(cps);
		expect(computed.code).toBe("in_transit");
		expect(explanation.length).toBeGreaterThan(5);
	});
});
