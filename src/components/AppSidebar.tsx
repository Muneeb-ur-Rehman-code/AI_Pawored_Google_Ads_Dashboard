import {
  LayoutDashboard, Table2, KanbanSquare, Upload, Layers3, FileOutput, Plug, Settings, Sparkles, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const analyticsNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Table2 },
  { title: "Actions", url: "/actions", icon: KanbanSquare },
];

const optimizationNav = [
  { title: "Product Feed Optimisation", url: "/feed-optimiser", icon: Sparkles },
  { title: "Segments", url: "/segments", icon: Layers3 },
  { title: "Feed Export", url: "/feed-export", icon: FileOutput },
];

const dataNav = [
  { title: "Integrations", url: "/integrations", icon: Plug },
  { title: "Uploads", url: "/uploads", icon: Upload },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (label: string, items: typeof analyticsNav) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink to={item.url} end className="hover:bg-accent/50" activeClassName="bg-accent font-medium">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-4">
        {!collapsed ? (
          <div>
            <h1 className="text-[13px] font-semibold text-foreground">360 Commerce</h1>
            <p className="text-[11px] text-muted-foreground">Product Intelligence</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-[13px] font-bold text-foreground">360</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Analytics", analyticsNav)}
        {renderGroup("Optimization", optimizationNav)}
        {renderGroup("Data", dataNav)}
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/settings")}>
              <NavLink to="/settings" className="hover:bg-accent/50" activeClassName="bg-accent font-medium">
                <Settings className="mr-2 h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && user && (
          <div className="mt-2 flex items-center gap-2 rounded-md bg-accent px-3 py-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground">Last sync: 2 min ago</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
