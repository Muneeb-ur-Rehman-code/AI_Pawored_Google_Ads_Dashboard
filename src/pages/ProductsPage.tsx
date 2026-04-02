import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockProducts, Product, Recommendation } from "@/data/mockData";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { ProductDetailPanel } from "@/components/ProductDetailPanel";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey = keyof Product;
type SortDir = "asc" | "desc";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [recFilter, setRecFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("priorityScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = useMemo(() => [...new Set(mockProducts.map(p => p.category))], []);

  const filtered = useMemo(() => {
    let result = [...mockProducts];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
    }
    if (recFilter !== "all") result = result.filter(p => p.recommendation === recFilter);
    if (categoryFilter !== "all") result = result.filter(p => p.category === categoryFilter);
    result.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return result;
  }, [search, recFilter, categoryFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const fmt = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  const TH = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th
      className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left cursor-pointer select-none whitespace-nowrap hover:text-foreground"
      onClick={() => toggleSort(sortKeyName)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </span>
    </th>
  );

  return (
    <AppLayout>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-foreground">Product Intelligence</h2>
            <p className="text-body text-muted-foreground">{filtered.length} products</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search products or SKUs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-[240px] pl-8 text-body"
            />
          </div>
          <Select value={recFilter} onValueChange={setRecFilter}>
            <SelectTrigger className="h-8 w-[140px] text-body">
              <SelectValue placeholder="Recommendation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Recommendations</SelectItem>
              <SelectItem value="scale">Scale</SelectItem>
              <SelectItem value="optimise">Optimise</SelectItem>
              <SelectItem value="pause">Pause</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="exclude">Exclude</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 w-[140px] text-body">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-body">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <TH label="Product" sortKeyName="title" />
                <TH label="SKU" sortKeyName="sku" />
                <TH label="Category" sortKeyName="category" />
                <TH label="Price" sortKeyName="price" />
                <TH label="Margin %" sortKeyName="grossMarginPct" />
                <TH label="Spend" sortKeyName="spend" />
                <TH label="Revenue" sortKeyName="revenue" />
                <TH label="Orders" sortKeyName="orders" />
                <TH label="ROAS" sortKeyName="roas" />
                <TH label="BE ROAS" sortKeyName="breakEvenRoas" />
                <TH label="Contrib. Margin" sortKeyName="contributionMargin" />
                <TH label="Recommendation" sortKeyName="recommendation" />
                <TH label="Priority" sortKeyName="priorityScore" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="row-separator hover:bg-muted/30 cursor-pointer transition-colors duration-75"
                  onClick={() => setSelectedProduct(p)}
                >
                  <td className="px-3 py-2.5 font-medium text-foreground max-w-[200px] truncate">{p.title}</td>
                  <td className="px-3 py-2.5 font-mono text-small text-muted-foreground">{p.sku}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{p.category}</td>
                  <td className="px-3 py-2.5 tabular-nums">{fmt(p.price)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{p.grossMarginPct}%</td>
                  <td className="px-3 py-2.5 tabular-nums">{fmt(p.spend)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{fmt(p.revenue)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{p.orders}</td>
                  <td className={cn("px-3 py-2.5 tabular-nums font-medium", p.roas >= p.breakEvenRoas ? "text-positive" : "text-negative")}>
                    {p.roas.toFixed(2)}x
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{p.breakEvenRoas.toFixed(2)}x</td>
                  <td className={cn("px-3 py-2.5 tabular-nums font-medium", p.contributionMargin >= 0 ? "text-positive" : "text-negative")}>
                    {p.contributionMargin >= 0 ? "$" : "-$"}{Math.abs(p.contributionMargin).toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5"><RecommendationBadge value={p.recommendation} /></td>
                  <td className="px-3 py-2.5 tabular-nums font-medium">{p.priorityScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Panel */}
      {selectedProduct && (
        <ProductDetailPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </AppLayout>
  );
}
