import {
  LayoutDashboard, Building2, Users, Settings, ArrowLeftRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const adminNav = [
  { title: "Overview", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Brands", url: "/admin/brands", icon: Building2 },
  { title: "Team Management", url: "/admin/team", icon: Users },
  { title: "System Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-4">
        {!collapsed ? (
          <div>
            <h1 className="text-[13px] font-semibold text-foreground">360 Commerce</h1>
            <p className="text-[11px] text-muted-foreground">Admin Portal</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-[13px] font-bold text-foreground">360</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map(item => (
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
        <SidebarGroup>
          <SidebarGroupLabel>Switch View</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard" className="hover:bg-accent/50" activeClassName="">
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    {!collapsed && <span>User Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        {!collapsed && user && (
          <div className="flex items-center gap-2 rounded-md bg-accent px-3 py-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground">Admin</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
