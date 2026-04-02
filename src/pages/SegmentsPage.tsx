import { useState, useMemo } from 'react';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProducts } from "@/data/mockData";
import { Plus, X, Pencil, Trash2, RefreshCw, Save, Download, Layers3 } from "lucide-react";
import { toast } from 'sonner';

interface Segment {
  id: number;
  name: string;
  rules: string;
  products: number;
}

const initialSegments: Segment[] = [
  { id: 1, name: "Low ROAS Losers", rules: "ROAS < 2 AND Spend > $2,000", products: 12 },
  { id: 2, name: "High Margin Winners", rules: "Margin > 60% AND ROAS > 3", products: 8 },
  { id: 3, name: "Missing COGS", rules: "COGS = 0", products: 5 },
  { id: 4, name: "Ready for Scaling", rules: "Recommendation = Scale AND Status = Active", products: 15 },
];

interface Rule {
  field: string;
  operator: string;
  value: string;
  connector: 'AND' | 'OR';
}

const fieldOptions = ['ROAS', 'Spend', 'Revenue', 'Margin', 'Orders', 'Clicks', 'Category', 'Vendor', 'Recommendation', 'Status', 'Title'];
const operatorOptions = ['equals', 'not equals', 'greater than', 'less than', 'contains', 'does not contain'];

export default function SegmentsPage() {
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [segmentName, setSegmentName] = useState('New Segment');
  const [rules, setRules] = useState<Rule[]>([
    { field: 'ROAS', operator: 'greater than', value: '3', connector: 'AND' },
  ]);

  const matchCount = useMemo(() => Math.floor(Math.random() * 30) + 5, [rules]);
  const previewProducts = mockProducts.slice(0, 5);

  const addRule = () => setRules([...rules, { field: 'Spend', operator: 'greater than', value: '', connector: 'AND' }]);
  const removeRule = (i: number) => setRules(rules.filter((_, idx) => idx !== i));

  return (
    <AppLayout>
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-[18px] font-semibold text-foreground">Product Segments</h2>
          <p className="text-body text-muted-foreground">Group products with dynamic rule-based filters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Saved Segments */}
          <div className="space-y-3">
            <h3 className="text-body font-semibold text-foreground">Saved Segments</h3>
            {initialSegments.map(seg => (
              <div
                key={seg.id}
                className={`rounded-lg border p-4 cursor-pointer transition-colors ${selectedSegment === seg.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-foreground/20'}`}
                onClick={() => { setSelectedSegment(seg.id); setSegmentName(seg.name); }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-body font-semibold text-foreground">{seg.name}</h4>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
                <p className="mt-1 text-small text-muted-foreground font-mono">{seg.rules}</p>
                <p className="mt-2 text-small text-muted-foreground">{seg.products} products matched</p>
              </div>
            ))}
          </div>

          {/* Right: Segment Builder */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <h3 className="text-body font-semibold text-foreground">Segment Builder</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Segment Name</label>
                <Input value={segmentName} onChange={e => setSegmentName(e.target.value)} placeholder="New Segment" />
              </div>

              {/* Rule builder */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rules</label>
                {rules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap">
                    <Select value={rule.field} onValueChange={v => { const nr = [...rules]; nr[i].field = v; setRules(nr); }}>
                      <SelectTrigger className="h-8 w-[120px] text-body"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {fieldOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={rule.operator} onValueChange={v => { const nr = [...rules]; nr[i].operator = v; setRules(nr); }}>
                      <SelectTrigger className="h-8 w-[140px] text-body"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {operatorOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input
                      value={rule.value}
                      onChange={e => { const nr = [...rules]; nr[i].value = e.target.value; setRules(nr); }}
                      className="h-8 w-[100px] text-body"
                      placeholder="Value"
                    />
                    {i < rules.length - 1 && (
                      <Select value={rule.connector} onValueChange={v => { const nr = [...rules]; nr[i].connector = v as 'AND' | 'OR'; setRules(nr); }}>
                        <SelectTrigger className="h-8 w-[70px] text-body"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeRule(i)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-body gap-1.5" onClick={addRule}>
                    <Plus className="h-3.5 w-3.5" /> Add Condition
                  </Button>
                  <Button variant="outline" size="sm" className="text-body gap-1.5" onClick={addRule}>
                    <Plus className="h-3.5 w-3.5" /> Add Group
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-lg border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-body font-semibold text-foreground">
                  <span className="text-primary">{matchCount}</span> products match this segment
                </h3>
                <Button variant="outline" size="sm" className="text-body gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh Preview
                </Button>
              </div>
              <div className="rounded-lg border border-border overflow-x-auto">
                <table className="w-full text-body">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {['SKU', 'Title', 'ROAS', 'Spend', 'Margin'].map(h => (
                        <th key={h} className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewProducts.map(p => (
                      <tr key={p.id} className="row-separator">
                        <td className="px-3 py-2 font-mono text-small">{p.sku}</td>
                        <td className="px-3 py-2 truncate max-w-[200px]">{p.title}</td>
                        <td className="px-3 py-2 tabular-nums">{p.roas.toFixed(2)}x</td>
                        <td className="px-3 py-2 tabular-nums">${p.spend.toLocaleString()}</td>
                        <td className="px-3 py-2 tabular-nums">{p.grossMarginPct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button className="gap-1.5" onClick={() => toast.success('Segment saved')}>
                <Save className="h-3.5 w-3.5" /> Save Segment
              </Button>
              <Button variant="outline" onClick={() => toast.success('Segment applied to dashboard')}>Apply to Dashboard</Button>
              <Button variant="outline" className="gap-1.5" onClick={() => toast.success('Export started')}>
                <Download className="h-3.5 w-3.5" /> Export Segment
              </Button>
              <Button variant="ghost" onClick={() => { setRules([{ field: 'ROAS', operator: 'greater than', value: '', connector: 'AND' }]); setSegmentName('New Segment'); }}>Clear</Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
