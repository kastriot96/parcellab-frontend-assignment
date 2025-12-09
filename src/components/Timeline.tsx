import { relativeDayLabel } from "@/lib/format";
import type { Checkpoint } from "@/types/order";
import { ProgressBar } from "./ui/progressbar";
import { Separator } from "./ui/separator";

export function Timeline({
	checkpoints,
	tz,
}: {
	checkpoints: Checkpoint[];
	tz: string;
}) {
	const sortedCheckpoints = [...(checkpoints ?? [])].sort(
		(a, b) =>
			new Date(b.event_timestamp).getTime() -
			new Date(a.event_timestamp).getTime(),
	);

	return (
		<div className="relative mb-4">
			{sortedCheckpoints.map((checkpoint, index) => {
				const isMostRecent = index === 0;
				const completed = index > 0;
				const isLast = index === sortedCheckpoints.length - 1;

				return (
					<div key={index} className="grid gap-1 relative">
						<ProgressBar
							isMostRecent={isMostRecent}
							completed={completed}
							isLast={isLast}
						/>

						<div className="ml-6">
							<div className="flex items-center gap-2">
								<span className="font-medium">{checkpoint.status}</span>
								<span className="text-xs text-muted-foreground">
									{relativeDayLabel(checkpoint.event_timestamp, tz)}
								</span>
							</div>

							<div className="text-sm text-muted-foreground">
								{checkpoint.status_details}
							</div>

							{(checkpoint.city || checkpoint.country_iso3) && (
								<div className="text-xs text-muted-foreground">
									{checkpoint.city}
									{checkpoint.city && checkpoint.country_iso3 ? ", " : ""}
									{checkpoint.country_iso3}
								</div>
							)}

							{!isLast && <Separator className="my-3 ml-4" />}
						</div>
					</div>
				);
			})}

			{sortedCheckpoints.length === 0 && (
				<p className="text-sm text-muted-foreground">No checkpoints yet.</p>
			)}
		</div>
	);
}
