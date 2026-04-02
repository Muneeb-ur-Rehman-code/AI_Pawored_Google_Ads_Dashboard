import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockProducts, Product } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil, Search, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TitleSuggestion {
  original: string;
  suggestions: string[];
}

function generateSuggestions(product: Product): string[] {
  const { title, category, vendor, price } = product;
  const keywords = [category, vendor].filter(Boolean);
  return [
    `${vendor} ${title.split(" - ")[1] || title} | ${category} – Shop Now`,
    `${title.split(" - ")[1] || title} by ${vendor} | Premium ${category} | $${price.toFixed(0)}`,
    `${keywords.join(" ")} – ${title.split(" - ")[1] || title} | Free Shipping`,
  ];
}

function computePriorityScore(p: Product): number {
  const clickSignal = Math.min(p.clicks / 5000, 1) * 25;
  const roasSignal = (p.roas < 2 ? 1 : p.roas < 4 ? 0.5 : 0.2) * 25;
  const spendSignal = Math.min(p.spend / 8000, 1) * 20;
  const orderSignal = (1 - Math.min(p.orders / 200, 1)) * 15;
  const revenueSignal = Math.min(p.revenue / 15000, 1) * 15;
  return Math.min(100, Math.max(0, Math.round(clickSignal + roasSignal + spendSignal + orderSignal + revenueSignal)));
}

const PAGE_SIZE = 20;

export default function FeedOptimiserPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [acceptedTitles, setAcceptedTitles] = useState<Record<string, string>>({});
  const [editDialog, setEditDialog] = useState<{ productId: string; title: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  const enrichedProducts = useMemo(
    () =>
      mockProducts.map((p) => ({
        ...p,
        feedPriority: computePriorityScore(p),
        suggestions: generateSuggestions(p),
      })),
    []
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enrichedProducts
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q)
      )
      .sort((a, b) => b.feedPriority - a.feedPriority);
  }, [enrichedProducts, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleAccept = (productId: string, title: string) => {
    setAcceptedTitles((prev) => ({ ...prev, [productId]: title }));
    toast({ title: "Title accepted", description: title });
  };

  const openEdit = (productId: string, title: string) => {
    setEditValue(title);
    setEditDialog({ productId, title });
  };

  const saveEdit = () => {
    if (editDialog) {
      setAcceptedTitles((prev) => ({ ...prev, [editDialog.productId]: editValue }));
      toast({ title: "Custom title saved", description: editValue });
      setEditDialog(null);
    }
  };

  const priorityColor = (score: number) => {
    if (score >= 70) return "bg-destructive/15 text-destructive border-destructive/30";
    if (score >= 40) return "bg-amber-500/15 text-amber-700 border-amber-500/30";
    return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
  };

  const renderPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Feed Title Optimiser
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Improve product titles to boost CTR and ad performance. {filtered.length} SKUs · sorted by priority.
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search SKU, title, vendor…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead className="w-[100px]">SKU</TableHead>
                <TableHead className="min-w-[200px]">Current Title</TableHead>
                <TableHead className="min-w-[340px]">AI Suggestions</TableHead>
                <TableHead className="w-[90px] text-center">Priority</TableHead>
                <TableHead className="w-[140px]">Accepted Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((product) => (
                <TableRow key={product.id} className="group">
                  <TableCell className="py-3">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-10 w-10 rounded border border-border object-cover"
                      loading="lazy"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {product.sku}
                    <div className="text-[10px] opacity-60">{product.id}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">{product.title}</span>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {product.vendor} · {product.category}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      {product.suggestions.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1.5 group/suggestion"
                        >
                          <span className="shrink-0 mt-0.5 text-[10px] font-medium text-muted-foreground w-4">
                            {idx + 1}.
                          </span>
                          <span className="text-xs text-foreground flex-1 leading-relaxed">
                            {s}
                          </span>
                          <div className="flex gap-0.5 shrink-0 opacity-0 group-hover/suggestion:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleAccept(product.id, s)}
                              title="Accept"
                            >
                              <Check className="h-3 w-3 text-emerald-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => openEdit(product.id, s)}
                              title="Edit"
                            >
                              <Pencil className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${priorityColor(product.feedPriority)}`}
                    >
                      {product.feedPriority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {acceptedTitles[product.id] ? (
                      <span className="text-xs text-primary font-medium line-clamp-2">
                        {acceptedTitles[product.id]}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {renderPageNumbers().map((page, i) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`e-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page as number)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Title Suggestion</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={3}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">{editValue.length} characters</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Title</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
