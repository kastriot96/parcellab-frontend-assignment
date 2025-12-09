import { AlertCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Articles } from "@/components/Articles";
import { OrderHeader } from "@/components/OrderHeader";
import { Timeline } from "@/components/Timeline";
import { ActionStatus } from "@/components/ui/action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ZipUnlock } from "@/components/ZipUnlock";
import { getStatusWithExplanation } from "@/lib/status";
import type { LocationState, Shipment } from "@/types/order";

export default function OrderDetails() {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const state = location.state as LocationState | null;

	const [shipments, setShipments] = useState<Shipment[]>([]);
	const [error, setError] = useState<string | null>(null);

	const [zip, setZip] = useState("");
	const [pendingZip, setPendingZip] = useState("");
	const [zipValid, setZipValid] = useState(false);
	const [zipError, setZipError] = useState<string | null>(null);

	const tz = shipments[0]?.delivery_info?.timezone ?? "UTC";
	const showFullDetails = zipValid;

	function goToLookup() {
		window.location.href = "/";
	}

	useEffect(() => {
		if (state?.order) {
			const params = new URLSearchParams(location.search);
			const z = params.get("zip");

			if (z) {
				setZip(z);
				setZipValid(true);
			} else {
				setZipValid(true);
			}
			setShipments([state.order as Shipment]);
		}
	}, [state, location.search]);

	useEffect(() => {
		if (shipments.length || !id) return;

		let url = `/orders/${encodeURIComponent(id)}`;
		if (zipValid && zip) url += `?zip=${encodeURIComponent(zip)}`;

		fetch(url)
			.then((res) => {
				if (!res.ok) {
					setError("Order not preloaded. Please go through Lookup.");
					return null;
				}
				return res.json();
			})
			.then((data: Shipment[] | null) => {
				if (!data) return;
				if (!data.length) {
					setError("Order not found");
					return;
				}
				setShipments(data);
			});
	}, [id, shipments, zip, zipValid]);

	function handleZipSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!pendingZip) return;

		setZip(pendingZip);
		setZipValid(false);
		setZipError(null);

		fetch(
			`/orders/${encodeURIComponent(id ?? "")}?zip=${encodeURIComponent(pendingZip)}`,
		)
			.then((res) => {
				if (!res.ok) throw new Error("ZIP mismatch");
				return res.json();
			})
			.then((data: Shipment[]) => {
				if (!data.length) throw new Error("Order not found");
				setShipments(data);
				setZipValid(true);
				setZipError(null);
			})
			.catch(() => {
				setZipValid(false);
				setZipError("Lookup failed: ZIP mismatch");
			});
	}

	if (error)
		// biome-ignore lint/suspicious/noArrayIndexKey: synthetic data without stable ids
		return (
			<div className="max-w-xl mx-auto py-12 px-4">
				<Alert className="border-destructive">
					<AlertTitle className="flex items-center gap-2">
						<AlertCircle className="text-destructive" />
						Error
					</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
					<Button variant="outline" className="mt-4" onClick={goToLookup}>
						Go to Lookup
					</Button>
				</Alert>
			</div>
		);

	if (!shipments.length)
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<Clock className="animate-spin mb-3" size={36} />
				<p className="text-lg text-muted-foreground">
					Loading your shipment details…
				</p>
			</div>
		);

	const firstShipment: Shipment = shipments[0]!;

	return (
		<div className="max-w-full sm:max-w-4xl mx-auto py-8 px-4 sm:px-0 space-y-10">
			<OrderHeader order={firstShipment} />

			{!zipValid && (
				<ZipUnlock
					pendingZip={pendingZip}
					setPendingZip={setPendingZip}
					onSubmit={handleZipSubmit}
				/>
			)}

			{zipError && (
				<Alert role="alert" className="mt-2">
					<AlertTitle>Lookup failed</AlertTitle>
					<AlertDescription>{zipError}</AlertDescription>
				</Alert>
			)}

			{showFullDetails && (
				<div className="space-y-8">
					{shipments.map((shipment, idx) => {
						const statusInfo = getStatusWithExplanation(
							shipment.checkpoints ?? [],
							tz,
						);

						return (
							<Card key={shipment._id} className="shadow-md border rounded-xl">
								<CardHeader className="pb-3">
									<CardTitle className="flex justify-between items-center">
										<div>
											Shipment
											{shipments.length > 1 && (
												<span className="ml-2 text-xs px-2 py-1 bg-primary/10 rounded-full">
													{idx + 1} of {shipments.length}
												</span>
											)}
										</div>
									</CardTitle>

									<div className="text-sm text-muted-foreground mt-1">
										Tracking:{" "}
										<span className="font-mono">
											{shipment.tracking_number ?? "N/A"}
										</span>
									</div>
								</CardHeader>

								<CardContent className="grid gap-6 pt-2">
									{statusInfo && (
										<ActionStatus
											label={statusInfo.computed.label}
											explanation={statusInfo.explanation}
											nextAction={statusInfo.nextAction}
											bgColor={"blue"}
										/>
									)}

									<Separator className="my-1" />

									{(shipment.delivery_info?.articles?.length ?? 0) > 0 && (
										<Articles articles={shipment.delivery_info!.articles!} />
									)}

									<Timeline checkpoints={shipment.checkpoints ?? []} tz={tz} />
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			<div className="flex flex-col sm:flex-row gap-3 pt-4">
				<Button variant="secondary" className="py-5 text-base">
					Contact Support
				</Button>

				{firstShipment.delivery_info?.orderNo && (
					<Button asChild className="py-5 text-base">
						<a
							href="https://parcellab.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Track on Carrier Site
						</a>
					</Button>
				)}
			</div>
		</div>
	);
}
