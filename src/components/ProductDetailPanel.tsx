import { Product, generateDailyPerformance } from "@/data/mockData";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

interface Props {
  product: Product;
  onClose: () => void;
}

export function ProductDetailPanel({ product, onClose }: Props) {
  const perfData = useMemo(() => generateDailyPerformance(30), [product.id]);
  const fmt = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-foreground/10" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-[600px] max-w-full bg-background border-l border-border animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div className="flex items-start gap-3 min-w-0">
            <img src={product.imageUrl} alt="" className="h-14 w-14 rounded-md bg-muted object-cover shrink-0" />
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold text-foreground truncate">{product.title}</h2>
              <p className="text-small text-muted-foreground font-mono">{product.sku}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <RecommendationBadge value={product.recommendation} />
                <span className="text-small text-muted-foreground capitalize">{product.status}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="w-full rounded-none border-b border-border bg-transparent px-5 h-10">
              <TabsTrigger value="performance" className="text-body data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none">Performance</TabsTrigger>
              <TabsTrigger value="insights" className="text-body data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none">AI Insights</TabsTrigger>
              <TabsTrigger value="history" className="text-body data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none">History</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="p-5 space-y-5">
              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Spend", value: fmt(product.spend) },
                  { label: "Revenue", value: fmt(product.revenue) },
                  { label: "ROAS", value: `${product.roas.toFixed(2)}x` },
                  { label: "Orders", value: product.orders },
                  { label: "Margin", value: `${product.grossMarginPct}%` },
                  { label: "Contrib. Margin", value: `${product.contributionMargin >= 0 ? "" : "-"}$${Math.abs(product.contributionMargin).toLocaleString()}` },
                ].map(m => (
                  <div key={m.label} className="rounded-md bg-muted/50 p-3">
                    <p className="text-table-header uppercase text-muted-foreground tracking-wider">{m.label}</p>
                    <p className="mt-1 text-[16px] font-semibold tabular-nums text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Spend trend */}
              <div>
                <h4 className="text-body font-medium text-foreground mb-2">Spend & Revenue Trend</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={perfData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 90%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={(v) => v.slice(5)} stroke="hsl(240, 4%, 46%)" />
                    <YAxis tick={{ fontSize: 9 }} stroke="hsl(240, 4%, 46%)" />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="spend" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Product details */}
              <div className="space-y-2">
                <h4 className="text-body font-medium text-foreground">Product Info</h4>
                {[
                  { label: "Category", value: product.category },
                  { label: "Vendor", value: product.vendor },
                  { label: "Price", value: fmt(product.price) },
                  { label: "COGS", value: fmt(product.cogs) },
                  { label: "Break-even ROAS", value: `${product.breakEvenRoas.toFixed(2)}x` },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between py-1.5 row-separator text-body">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-medium text-foreground tabular-nums">{r.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="p-5 space-y-4">
              <div className="rounded-md border border-border p-4">
                <h4 className="text-body font-semibold text-foreground mb-2">AI Recommendation</h4>
                <p className="text-body text-muted-foreground leading-relaxed">{product.aiSummary}</p>
              </div>
              <div className="rounded-md border border-border p-4">
                <h4 className="text-body font-semibold text-foreground mb-2">Suggested Actions</h4>
                <ul className="list-disc list-inside text-body text-muted-foreground space-y-1">
                  <li>Review current bid strategy and adjust CPA targets</li>
                  <li>Analyze search term report for irrelevant queries</li>
                  <li>Check product page conversion rate vs category average</li>
                  <li>Consider audience segment performance breakdown</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-5">
              <div className="space-y-3">
                {[
                  { date: "Mar 14, 2026", action: "Recommendation changed to " + product.recommendation, user: "System" },
                  { date: "Mar 12, 2026", action: "Bid adjusted to $1.45", user: "Sarah M." },
                  { date: "Mar 10, 2026", action: "Added to 'Low ROAS' segment", user: "System" },
                  { date: "Mar 8, 2026", action: "COGS updated from margin upload", user: "James K." },
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 row-separator">
                    <div className="h-2 w-2 rounded-full bg-border mt-1.5 shrink-0" />
                    <div>
                      <p className="text-body text-foreground">{h.action}</p>
                      <p className="text-small text-muted-foreground">{h.date} · {h.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 flex items-center gap-2">
          <Button variant="default" size="sm" className="text-body">Save Action</Button>
          <Button variant="outline" size="sm" className="text-body">Add Note</Button>
        </div>
      </div>
    </>
  );
}
