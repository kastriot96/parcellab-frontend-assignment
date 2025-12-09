import type { ProgressBarProps } from "@/types/order";

export function ProgressBar({
	isMostRecent,
	completed,
	isLast,
}: ProgressBarProps) {
	return (
		<div className="absolute -left-2 top-1 flex flex-col items-center h-full">
			<div
				className={`w-3 h-3 rounded-full ${completed || isMostRecent ? "bg-blue-600" : "bg-gray-300"} ${isMostRecent ? "outline outline-4 outline-blue-300" : ""}`}
			/>
			{!isLast && <div className="w-0.5 flex-1 mt-2 mb-1 bg-blue-300" />}
		</div>
	);
}
