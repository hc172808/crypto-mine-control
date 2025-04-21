
import React, { useState } from "react";
import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Home, Settings, Activity, Database, Server, 
  LogOut, Menu, User, BarChart2
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Mining Tasks", href: "/mining", icon: Server },
    { name: "Statistics", href: "/statistics", icon: BarChart2 },
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Profile", href: "/profile", icon: User },
    ...(user.role === "admin" 
      ? [
          { name: "Admin Dashboard", href: "/admin", icon: Database },
          { name: "User Management", href: "/admin/users", icon: User },
        ] 
      : []),
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-sidebar text-sidebar-foreground lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b border-sidebar-border">
            <h2 className="text-xl font-bold text-sidebar-foreground">
              Mining Control
            </h2>
            <p className="text-sm text-sidebar-foreground/80">
              {user.role === "admin" ? "Admin Panel" : "User Dashboard"}
            </p>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center bg-sidebar-accent hover:bg-sidebar-accent/70 text-sidebar-accent-foreground"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : ""
        )}
      >
        <main className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
