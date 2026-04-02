import { useState } from 'react';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [showPwModal, setShowPwModal] = useState(false);

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-3xl">
        <div>
          <h2 className="text-[18px] font-semibold text-foreground">Settings</h2>
          <p className="text-body text-muted-foreground">Manage your profile and preferences</p>
        </div>

        {/* User Profile */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h3 className="text-body font-semibold text-foreground">User Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Photo</label>
              <div className="rounded-md border-2 border-dashed border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Upload photo</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue="Sarah Mitchell" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue="sarah@360-om.co.uk" disabled />
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowPwModal(true)}>Change Password</Button>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h3 className="text-body font-semibold text-foreground">Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { label: 'Email Notifications', defaultChecked: true },
              { label: 'Weekly Summary Reports', defaultChecked: true },
              { label: 'Alert on Sync Failures', defaultChecked: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.label}</span>
                <Switch defaultChecked={item.defaultChecked} />
              </div>
            ))}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">Alert on ROAS Drops</span>
                <Input type="number" defaultValue="20" className="h-7 w-16 text-sm" />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h3 className="text-body font-semibold text-foreground">Display Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Dark Mode</span>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Date Range</label>
              <Select defaultValue="30d">
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="14d">Last 14 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Table Rows Per Page</label>
              <Select defaultValue="50">
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Export Preferences */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h3 className="text-body font-semibold text-foreground">Export Preferences</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Format</label>
              <Select defaultValue="csv">
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked /> Include Headers in Exports
            </label>
            <div className="space-y-2">
              <label className="text-sm font-medium">Decimal Places</label>
              <Select defaultValue="2">
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={() => toast.success('Settings saved')}>Save All Changes</Button>
      </div>

      <Dialog open={showPwModal} onOpenChange={setShowPwModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input type="password" placeholder="Current password" />
            <Input type="password" placeholder="New password" />
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPwModal(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Password updated'); setShowPwModal(false); }}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
