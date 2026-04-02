import { useState } from 'react';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { mockProducts, mockExportHistory } from "@/data/mockData";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { FileSpreadsheet, Plus, X, ExternalLink, Download } from "lucide-react";
import { toast } from 'sonner';

const labelRules = [
  { condition: 'Recommendation = Scale', label: 'custom_label_0', value: 'hero' },
  { condition: 'Recommendation = Optimise', label: 'custom_label_0', value: 'optimise' },
  { condition: 'Margin > 50%', label: 'custom_label_1', value: 'high_margin' },
];

const filterRules = [
  { field: 'Recommendation', operator: 'equals', value: 'Scale' },
  { field: 'Status', operator: 'equals', value: 'Active' },
];

export default function FeedExportPage() {
  const [showHistory, setShowHistory] = useState(false);
  const exportProducts = mockProducts.filter(p => p.recommendation === 'scale' && p.status === 'active').slice(0, 10);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-[18px] font-semibold text-foreground">Supplemental Feed Export</h2>
          <p className="text-body text-muted-foreground">Push product changes to Merchant Center via Google Sheet sync</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Google Sheet Connection */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-positive" />
              <h3 className="text-body font-semibold text-foreground">Google Sheet Connection</h3>
            </div>
            <div className="space-y-2 text-small text-muted-foreground">
              <p>Connected Sheet: <span className="font-medium text-foreground">360-Product-Feed-Export</span></p>
              <p className="flex items-center gap-1">
                URL: <a href="#" className="text-primary hover:underline inline-flex items-center gap-1">docs.google.com/spreadsheets/d/abc123... <ExternalLink className="h-3 w-3" /></a>
              </p>
              <p>Last Export: 1 hour ago</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-small text-muted-foreground">Auto-Export</span>
              <Switch defaultChecked />
              <Select defaultValue="hourly">
                <SelectTrigger className="h-7 w-[100px] text-body"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-body">Open Sheet</Button>
              <Button variant="outline" size="sm" className="text-body text-destructive">Disconnect</Button>
            </div>
          </div>

          {/* Export Filters */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <h3 className="text-body font-semibold text-foreground">Export Filters</h3>
            <p className="text-small text-muted-foreground">Only export products where...</p>
            <div className="space-y-2">
              {filterRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2 text-small">
                  <Badge variant="outline" className="text-[10px]">{rule.field}</Badge>
                  <span className="text-muted-foreground">{rule.operator}</span>
                  <Badge variant="secondary" className="text-[10px]">{rule.value}</Badge>
                  <Button variant="ghost" size="icon" className="h-5 w-5"><X className="h-3 w-3" /></Button>
                  {i < filterRules.length - 1 && <span className="text-muted-foreground font-medium">AND</span>}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="text-body gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Condition
            </Button>
            <p className="text-small text-muted-foreground">Currently matching <span className="font-medium text-foreground">45 products</span></p>
          </div>
        </div>

        {/* Label Mapping */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <h3 className="text-body font-semibold text-foreground">Custom Label Rules</h3>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-body">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left">Condition</th>
                  <th className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left">Label</th>
                  <th className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left">Value</th>
                  <th className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left w-10"></th>
                </tr>
              </thead>
              <tbody>
                {labelRules.map((rule, i) => (
                  <tr key={i} className="row-separator">
                    <td className="px-3 py-2 text-muted-foreground">{rule.condition}</td>
                    <td className="px-3 py-2 font-mono text-small">{rule.label}</td>
                    <td className="px-3 py-2 font-medium">{rule.value}</td>
                    <td className="px-3 py-2"><Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"><X className="h-3 w-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="outline" size="sm" className="text-body gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Rule</Button>
        </div>

        {/* Export Preview */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <h3 className="text-body font-semibold text-foreground">Export Preview (Top 10)</h3>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-body">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['', 'SKU', 'Title', 'Recommendation', 'custom_label_0', 'custom_label_1', 'Status'].map(h => (
                    <th key={h} className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exportProducts.map(p => (
                  <tr key={p.id} className="row-separator hover:bg-muted/30">
                    <td className="px-3 py-2"><Checkbox /></td>
                    <td className="px-3 py-2 font-mono text-small">{p.sku}</td>
                    <td className="px-3 py-2 max-w-[200px] truncate">{p.title}</td>
                    <td className="px-3 py-2"><RecommendationBadge value={p.recommendation} /></td>
                    <td className="px-3 py-2">
                      <Select defaultValue="hero">
                        <SelectTrigger className="h-7 w-[100px] text-body"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hero">hero</SelectItem>
                          <SelectItem value="optimise">optimise</SelectItem>
                          <SelectItem value="none">none</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Select defaultValue={p.grossMarginPct > 50 ? 'high_margin' : 'none'}>
                        <SelectTrigger className="h-7 w-[120px] text-body"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high_margin">high_margin</SelectItem>
                          <SelectItem value="low_margin">low_margin</SelectItem>
                          <SelectItem value="none">none</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="secondary" className="bg-scale/10 text-scale border-0">Ready</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.success('Preview generated')}>Preview Export</Button>
          <Button onClick={() => { toast.loading('Exporting...'); setTimeout(() => { toast.dismiss(); toast.success('Export complete — 45 products exported'); }, 2000); }}>
            Export Now
          </Button>
          <Button variant="outline" onClick={() => setShowHistory(true)}>Export History</Button>
        </div>
      </div>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Export History</DialogTitle></DialogHeader>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-body">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Timestamp', 'Products', 'Status', ''].map(h => (
                    <th key={h} className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockExportHistory.map(e => (
                  <tr key={e.id} className="row-separator">
                    <td className="px-3 py-2 text-muted-foreground text-small">{e.timestamp}</td>
                    <td className="px-3 py-2 tabular-nums">{e.productsExported}</td>
                    <td className="px-3 py-2">
                      <Badge variant="secondary" className={e.status === 'Success' ? 'bg-scale/10 text-scale border-0' : 'bg-pause/10 text-pause border-0'}>
                        {e.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      {e.status === 'Success' && <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3 w-3" /></Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
