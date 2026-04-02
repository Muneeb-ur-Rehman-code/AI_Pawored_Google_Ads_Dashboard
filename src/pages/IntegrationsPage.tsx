import { useState } from 'react';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, RefreshCw, Unplug, ShoppingBag, BarChart3, Store, LineChart } from "lucide-react";
import { toast } from 'sonner';

const integrations = [
  { name: "Google Ads", icon: BarChart3, connected: true, lastSync: "15 minutes ago", dataSynced: "342 products", account: "123-456-7890" },
  { name: "Merchant Center", icon: Store, connected: true, lastSync: "15 minutes ago", dataSynced: "342 products", account: "MC-789012" },
  { name: "Shopify", icon: ShoppingBag, connected: false, lastSync: "Never", dataSynced: "0 products", account: "" },
  { name: "GA4", icon: LineChart, connected: false, lastSync: "Never", dataSynced: "0 products", account: "" },
];

export default function IntegrationsPage() {
  const [disconnectTarget, setDisconnectTarget] = useState<string | null>(null);

  const handleSync = (name: string) => {
    toast.loading(`Syncing ${name}...`);
    setTimeout(() => { toast.dismiss(); toast.success(`${name} sync complete`); }, 2000);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-[18px] font-semibold text-foreground">Integrations</h2>
          <p className="text-body text-muted-foreground">Connect your data sources</p>
        </div>

        {/* Brand context */}
        <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-center justify-between">
          <span className="text-body text-muted-foreground">Viewing integrations for:</span>
          <Select defaultValue="acme">
            <SelectTrigger className="h-7 w-[180px] text-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acme">Acme Footwear</SelectItem>
              <SelectItem value="summit">Summit Outdoor</SelectItem>
              <SelectItem value="urban">Urban Lifestyle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Health summary */}
        <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-positive" />
          <div>
            <p className="text-body font-medium text-foreground">3 of 4 integrations connected</p>
            <p className="text-small text-muted-foreground">Last successful sync: 15 min ago</p>
          </div>
        </div>

        {/* Integration cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrations.map(int => (
            <div key={int.name} className={`rounded-lg border border-border bg-card p-5 space-y-3 ${!int.connected ? 'opacity-70' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <int.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-body font-semibold text-foreground">{int.name}</h3>
                  <Badge variant="secondary" className={int.connected ? 'bg-scale/10 text-scale border-0' : 'bg-muted text-muted-foreground border-0'}>
                    {int.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1 text-small text-muted-foreground">
                <p>Last Sync: {int.lastSync}</p>
                <p>Data Synced: {int.dataSynced}</p>
                {int.account && <p>Account: {int.account}</p>}
              </div>
              <div className="flex gap-2">
                {int.connected ? (
                  <>
                    <Button variant="outline" size="sm" className="text-body gap-1.5" onClick={() => handleSync(int.name)}>
                      <RefreshCw className="h-3.5 w-3.5" /> Sync Now
                    </Button>
                    <Button variant="outline" size="sm" className="text-body gap-1.5 text-destructive" onClick={() => setDisconnectTarget(int.name)}>
                      <Unplug className="h-3.5 w-3.5" /> Disconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="text-body">Connect</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!disconnectTarget} onOpenChange={() => setDisconnectTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Disconnect {disconnectTarget}?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will stop syncing data from {disconnectTarget}. You can reconnect at any time.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisconnectTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { toast.success(`${disconnectTarget} disconnected`); setDisconnectTarget(null); }}>Disconnect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
