import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { OrderHeader } from "@/components/OrderHeader";
import { Timeline } from "@/components/Timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

	if (error) return <p className="text-destructive">{error}</p>;
	if (!shipments.length) return <p>Loading…</p>;

	return (
		<div className="grid gap-6">
			{shipments.map((shipment) => (
				<Card key={shipment._id}>
					<CardHeader>
						<CardTitle>
							Shipment ({shipment.courier?.toUpperCase() ?? "Carrier"}{" "}
							{shipment.tracking_number ?? "N/A"})
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						<OrderHeader order={shipment as Order} />
						<Separator />
						<Timeline checkpoints={shipment.checkpoints ?? []} tz={tz} />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
