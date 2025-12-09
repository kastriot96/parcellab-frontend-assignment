import { Clock, Package } from "lucide-react";
import { useMemo } from "react";
import { getStatusWithExplanation } from "@/lib/status";
import type { InfoItemProps, Order } from "@/types/order";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ActionStatus } from "@/components/ui/action";

function InfoItem({ label, value, capitalize }: InfoItemProps) {
	if (!value) return null;
	return (
		<div>
			<div className="text-xs text-muted-foreground">{label}</div>
			<div className="font-semibold">
				{capitalize ? value.charAt(0).toUpperCase() + value.slice(1) : value}
			</div>
		</div>
	);
}

export function OrderHeader({ order }: { order: Order }) {
	const info = order.delivery_info;
	const tz = info?.timezone ?? "UTC";

	const statusInfo = useMemo(() => {
		return order.checkpoints
			? getStatusWithExplanation(order.checkpoints, tz)
			: null;
	}, [order, tz]);

	const orderNo = info?.orderNo ?? order._id;
	const eta = info?.announced_delivery_date
		? new Date(info.announced_delivery_date).toLocaleDateString("en-US", {
				timeZone: tz,
			})
		: null;

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Package className="text-primary" size={28} />
					Order <span className="font-mono">{orderNo}</span>
					{statusInfo && (
						<Badge className="ml-2" variant="outline">
							{statusInfo.computed.label}
						</Badge>
					)}
				</CardTitle>
			</CardHeader>

			<CardContent className="grid gap-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<InfoItem label="Recipient" value={info?.recipient} />
					<InfoItem label="Email" value={info?.email} />
					<InfoItem
						label="Address"
						value={
							info?.street && info?.city
								? `${info.street}, ${info.city}`
								: undefined
						}
					/>
					<InfoItem label="Carrier" value={order.courier} capitalize />
					<InfoItem
						label="Destination Country"
						value={order.destination_country_iso3}
					/>
				</div>

				{statusInfo && (
					<ActionStatus
						label={statusInfo.computed.label}
						explanation={statusInfo.explanation}
						nextAction={statusInfo.nextAction}
						bgColor={
							statusInfo.computed.code === "failed_attempt" ? "gray" : "blue"
						}
					/>
				)}
			</CardContent>

			{eta && (
				<div className="flex items-center gap-2 mt-4 ml-6 mb-2">
					<Clock className="text-muted-foreground" size={18} />
					<span>
						ETA: <span className="font-medium">{eta}</span>
					</span>
				</div>
			)}
		</Card>
	);
}
