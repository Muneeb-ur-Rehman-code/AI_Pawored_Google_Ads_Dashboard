import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { mockBrands, Brand } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Eye, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBrandsPage() {
  const [showModal, setShowModal] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [brandNotes, setBrandNotes] = useState('');

  const fmt = (n: number) => `$${n.toLocaleString()}`;

  const handleSave = () => {
    toast.success(`Brand "${brandName || 'New Brand'}" created`);
    setShowModal(false);
    setBrandName('');
    setBrandNotes('');
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-foreground">Brands</h2>
            <p className="text-body text-muted-foreground">Manage client accounts and brands</p>
          </div>
          <Button size="sm" className="text-body gap-1.5" onClick={() => setShowModal(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add New Brand
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-body">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Brand', 'Integrations', 'Products', 'Spend (30d)', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockBrands.map(brand => (
                <tr key={brand.id} className="row-separator hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <img src={brand.logo} alt="" className="h-8 w-8 rounded border border-border" />
                      <span className="font-medium text-foreground">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      {brand.integrations.shopify ? <CheckCircle2 className="h-3.5 w-3.5 text-positive" /> : <XCircle className="h-3.5 w-3.5 text-muted-foreground/40" />}
                      <span className="text-small">Shopify</span>
                      {brand.integrations.googleAds ? <CheckCircle2 className="h-3.5 w-3.5 text-positive ml-2" /> : <XCircle className="h-3.5 w-3.5 text-muted-foreground/40 ml-2" />}
                      <span className="text-small">Ads</span>
                      {brand.integrations.merchantCenter ? <CheckCircle2 className="h-3.5 w-3.5 text-positive ml-2" /> : <XCircle className="h-3.5 w-3.5 text-muted-foreground/40 ml-2" />}
                      <span className="text-small">MC</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{brand.productCount}</td>
                  <td className="px-3 py-3 tabular-nums">{fmt(brand.spend30d)}</td>
                  <td className="px-3 py-3">
                    <Badge variant={brand.status === 'Active' ? 'default' : 'secondary'}
                      className={brand.status === 'Active' ? 'bg-scale/10 text-scale border-0' : 'bg-optimise/10 text-optimise border-0'}>
                      {brand.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{brand.created}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Brand Name</label>
              <Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g. Acme Footwear" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Brand Logo</label>
              <div className="rounded-md border-2 border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">Drag & drop logo or click to upload</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <Textarea value={brandNotes} onChange={e => setBrandNotes(e.target.value)} placeholder="Optional notes..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Brand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
