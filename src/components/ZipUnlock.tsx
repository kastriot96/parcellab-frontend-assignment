import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ZipUnlock({
	pendingZip,
	setPendingZip,
	onSubmit,
	label = "Enter ZIP code to see full tracking details:",
	placeholder = "e.g. 60156",
	buttonLabel = "Unlock",
}: {
	pendingZip: string;
	setPendingZip: (v: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	label?: string;
	placeholder?: string;
	buttonLabel?: string;
}) {
	return (
		<form
			className="flex flex-col sm:flex-row gap-2 items-end"
			onSubmit={onSubmit}
		>
			<div className="flex-1">
				<label htmlFor="zip" className="block text-sm font-medium">
					{label}
				</label>
				<Input
					id="zip"
					value={pendingZip}
					onChange={(e) => setPendingZip(e.target.value)}
					autoComplete="off"
					placeholder={placeholder}
					className="mt-1"
				/>
			</div>
			<Button type="submit" className="h-10">
				{buttonLabel}
			</Button>
		</form>
	);
}
