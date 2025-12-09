import { AlertCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { OrderHeader } from "@/components/OrderHeader";
import { Timeline } from "@/components/Timeline";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order, Shipment } from "@/types/order";

export default function OrderDetails() {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const state = location.state as { order?: Order } | null;

	const [shipments, setShipments] = useState<Shipment[]>([]);
	const [error, setError] = useState<string | null>(null);

	const tz = shipments[0]?.delivery_info?.timezone ?? "UTC";

	useEffect(() => {
		if (state?.order) {
			setShipments([state.order as Shipment]);
		}
	}, [state]);

	useEffect(() => {
		if (shipments.length || !id) return;

		fetch(`/orders/${encodeURIComponent(id)}`)
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
	}, [id, shipments]);

	if (error)
		return (
			<div className="max-w-xl mx-auto py-12 px-4">
				<Alert className="border-destructive">
					<AlertTitle className="flex items-center gap-2">
						<AlertCircle className="text-destructive" />
						Error
					</AlertTitle>
					<AlertDescription>{error}</AlertDescription>

					<Button
						variant="outline"
						className="mt-4"
						onClick={() => (window.location.href = "/")}
					>
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

	const first: Shipment = shipments[0]!;

	return (
		<div className="max-w-full sm:max-w-4xl mx-auto py-8 px-4 sm:px-0 space-y-10">
			<OrderHeader order={first} />

			<div className="space-y-8">
				{shipments.map((shipment, idx) => (
					<Card key={shipment._id} className="shadow-md border rounded-xl">
						<CardHeader className="pb-3">
							<CardTitle className="flex justify-between items-center">
								<div>
									Shipment {idx + 1}
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
							<Timeline checkpoints={shipment.checkpoints ?? []} tz={tz} />
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex flex-col sm:flex-row gap-3 pt-4">
				<Button variant="secondary" className="py-5 text-base">
					Contact Support
				</Button>

				{first.delivery_info?.orderNo && (
					<Button asChild className="py-5 text-base">
						<a href="#" target="_blank" rel="noopener noreferrer">
							Track on Carrier Site
						</a>
					</Button>
				)}
			</div>
		</div>
	);
}
