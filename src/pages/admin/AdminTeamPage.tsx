import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { mockUsers, mockBrands } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil, UserMinus, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const roleColors: Record<string, string> = {
  admin: 'bg-primary/10 text-primary border-0',
  manager: 'bg-review/10 text-review border-0',
  viewer: 'bg-muted text-muted-foreground border-0',
};

export default function AdminTeamPage() {
  const [showModal, setShowModal] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleInvite = () => {
    toast.success('Invitation sent');
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-foreground">Team Management</h2>
            <p className="text-body text-muted-foreground">Manage users and permissions</p>
          </div>
          <Button size="sm" className="text-body gap-1.5" onClick={() => setShowModal(true)}>
            <Plus className="h-3.5 w-3.5" />
            Invite User
          </Button>
        </div>

        {/* Role descriptions */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-body font-semibold text-foreground">Role Permissions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-small text-muted-foreground">
            <div><span className="font-medium text-foreground">Admin:</span> Full access, can manage brands and users</div>
            <div><span className="font-medium text-foreground">Manager:</span> Can view/edit all data, export feeds</div>
            <div><span className="font-medium text-foreground">Viewer:</span> Read-only access to assigned brands</div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-body">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['User', 'Email', 'Role', 'Assigned Brands', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id} className="row-separator hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-small font-medium text-primary">
                        {user.initials}
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-3 py-3">
                    <Badge variant="secondary" className={roleColors[user.role]}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.assignedBrands.map(b => (
                        <Badge key={b} variant="outline" className="text-[10px] py-0">{b}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="secondary" className={user.status === 'Active' ? 'bg-scale/10 text-scale border-0' : 'bg-optimise/10 text-optimise border-0'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{user.lastLogin}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><UserMinus className="h-3.5 w-3.5" /></Button>
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
            <DialogTitle>Invite New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="john@360-om.co.uk" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input type={showPw ? 'text' : 'password'} placeholder="••••••••" />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select defaultValue="viewer">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned Brands</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox /> All Brands
                </label>
                {mockBrands.map(b => (
                  <label key={b.id} className="flex items-center gap-2 text-sm">
                    <Checkbox /> {b.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
