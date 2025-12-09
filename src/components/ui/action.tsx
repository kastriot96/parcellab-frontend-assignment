export interface ActionStatusProps {
	label: string;
	explanation: string;
	nextAction?: string;
	bgColor?: "green" | "blue" | "gray";
}

const bgColorMap = {
	green: "bg-green-50",
	blue: "bg-blue-50",
	gray: "bg-gray-100",
};

export function ActionStatus({
	label,
	explanation,
	nextAction,
	bgColor = "green",
}: ActionStatusProps) {
	return (
		<div className={`mt-4 p-4 rounded-md ${bgColorMap[bgColor]}`}>
			<h3 className="text-lg font-semibold">{label}</h3>
			<p className="text-sm text-muted-foreground mt-1">{explanation}</p>
			{nextAction && <p className="text-sm font-medium mt-2">{nextAction}</p>}
		</div>
	);
}
