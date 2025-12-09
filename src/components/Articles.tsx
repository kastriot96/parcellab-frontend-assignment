import type { Article } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function Articles({ articles }: { articles?: Article[] }) {
	if (!articles || articles.length === 0) {
		return <p className="text-muted-foreground">No articles in this order.</p>;
	}

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle>Articles in this order</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-3">
				{articles.map((article) => (
					<div
						key={article.articleNo}
						className="flex gap-4 items-center border rounded p-3 bg-muted"
					>
						{article.articleImageUrl ? (
							<a
								href={`https://shop.example.com/articles/${article.articleNo}`}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`View ${article.articleName} in shop`}
							>
								<img
									src={article.articleImageUrl}
									alt={article.articleName}
									className="w-16 h-16 object-cover rounded"
									loading="lazy"
								/>
							</a>
						) : (
							<div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-xs text-muted-foreground">
								No image
							</div>
						)}

						<div className="flex-1 grid gap-1">
							<div className="font-medium">{article.articleName}</div>
							<div className="text-sm text-muted-foreground">
								Quantity: {article.quantity} | Price: $
								{article.price.toFixed(2)}
							</div>
							{article.articleNo && (
								<Button
									asChild
									variant="ghost"
									size="sm"
									className="px-0 text-xs underline"
								>
									<a href={`#`} target="_blank" rel="noopener noreferrer">
										View in shop
									</a>
								</Button>
							)}
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
