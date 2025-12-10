import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";

export function SupportActions({ order }: { order: Order }) {
	return (
		<div className="flex flex-col sm:flex-row gap-3 pt-4">
			<Button variant="secondary" className="py-5 text-base">
				Contact Support
			</Button>

			{order.delivery_info?.orderNo && (
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
	);
}
