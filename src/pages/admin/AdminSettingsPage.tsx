import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-[18px] font-semibold text-foreground">System Settings</h2>
          <p className="text-body text-muted-foreground">Workspace and system configuration</p>
        </div>

        {/* Workspace Settings */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h3 className="text-body font-semibold text-foreground">Workspace Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Workspace Name</label>
              <Input defaultValue="360 Commerce" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Workspace Logo</label>
              <div className="rounded-md border-2 border-dashed border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Upload logo</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Currency</label>
              <Select defaultValue="gbp">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Timezone</label>
              <Select defaultValue="gmt">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmt">GMT (London)</SelectItem>
                  <SelectItem value="est">EST (New York)</SelectItem>
                  <SelectItem value="pst">PST (Los Angeles)</SelectItem>
                  <SelectItem value="cet">CET (Berlin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button size="sm" onClick={() => toast.success('Settings saved')}>Save Changes</Button>
        </div>

        {/* System Preferences */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h3 className="text-body font-semibold text-foreground">System Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Auto-Sync Frequency</label>
              <Select defaultValue="30">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                  <SelectItem value="360">Every 6 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Retention</label>
              <Select defaultValue="90">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select defaultValue="csv">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                  <SelectItem value="sheets">Google Sheets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg border-2 border-destructive/30 bg-card p-5 space-y-4">
          <h3 className="text-body font-semibold text-destructive">Danger Zone</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
              Delete Workspace
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Export started — you will receive an email when complete')}>
              Export All Data
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. All data, brands, and users will be permanently deleted.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { toast.error('Workspace deletion is disabled in demo mode'); setShowDeleteDialog(false); }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
