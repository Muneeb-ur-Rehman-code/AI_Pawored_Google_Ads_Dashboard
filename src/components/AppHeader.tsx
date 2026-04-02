import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockNotifications } from '@/data/mockData';
import { Search, Sun, Moon, Bell, LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/actions': 'Actions',
  '/feed-optimiser': 'Feed Optimisation',
  '/segments': 'Segments',
  '/feed-export': 'Feed Export',
  '/integrations': 'Integrations',
  '/uploads': 'Uploads',
  '/settings': 'Settings',
  '/admin/dashboard': 'Admin / Overview',
  '/admin/brands': 'Admin / Brands',
  '/admin/team': 'Admin / Team',
  '/admin/settings': 'Admin / Settings',
};

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const breadcrumb = breadcrumbMap[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-border bg-background px-4">
      <SidebarTrigger className="shrink-0" />
      <div className="h-4 w-px bg-border" />

      {/* Breadcrumb */}
      <span className="text-sm text-muted-foreground hidden md:block">{breadcrumb}</span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search products, SKUs, brands..."
          className="h-8 w-[220px] pl-8 text-body"
          readOnly
        />
      </div>

      {/* Dark mode toggle */}
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      {/* Notifications */}
      <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Notifications</span>
            <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setShowNotifications(false)}>Mark all read</Button>
          </div>
          <DropdownMenuSeparator />
          {mockNotifications.map(n => (
            <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2">
              <span className={`text-sm ${n.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{n.message}</span>
              <span className="text-xs text-muted-foreground">{n.timestamp}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-sm text-primary">View all</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
            {user?.initials || 'U'}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <User className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
