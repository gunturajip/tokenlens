"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, History, BarChart3, Settings, 
  HelpCircle, LogOut, Zap, Menu, X, Sparkles, 
  ChevronRight, BrainCircuit 
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const NAVIGATION = [
  { name: "Calculator", href: "/calculator", icon: LayoutDashboard },
  { name: "History", href: "/calculator/history", icon: History },
  { name: "Comparison", href: "/calculator/compare", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 h-full bg-[#111111] border-r border-border transition-all duration-300 ${isSidebarOpen ? "w-[260px]" : "w-0 lg:w-[80px]"} overflow-hidden flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <Zap className="text-primary-foreground" size={20} />
          </div>
          {isSidebarOpen && (
            <span className="font-black text-xl tracking-tighter text-white">
              Token<span className="text-primary">Lens</span>
            </span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
          {NAVIGATION.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive ? "bg-primary/10 text-primary shadow-inner" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
              >
                <item.icon size={20} className={isActive ? "text-primary" : "group-hover:text-primary transition-colors"} />
                {isSidebarOpen && (
                  <span className={`text-sm font-bold tracking-tight ${isActive ? "text-primary" : ""}`}>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          {isSidebarOpen && (
            <div className="p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-125 transition-transform">
                <Sparkles size={32} className="text-primary" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">PRO PLAN</p>
              <h4 className="text-sm font-bold text-foreground mb-2">Upgrade to Pro</h4>
              <p className="text-[10px] text-muted-foreground font-medium mb-3 leading-relaxed">Unlock advanced file parsing & high-precision AI estimation.</p>
              <button className="w-full py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-1">
                Upgrade Now <ChevronRight size={12} />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 rounded-xl cursor-pointer transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-black text-xs">
              JD
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-foreground">John Doe</p>
                <p className="text-[10px] text-muted-foreground truncate font-medium">john@example.com</p>
              </div>
            )}
            {isSidebarOpen && <LogOut size={16} className="text-muted-foreground hover:text-destructive transition-colors" />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden h-screen">
        <header className="h-16 border-b border-border bg-[#0A0A0A]/50 backdrop-blur-xl flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <h1 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2 uppercase">
              <BrainCircuit className="text-primary" size={16} />
              Dashboard <span className="text-muted-foreground">/</span> {NAVIGATION.find(n => n.href === pathname)?.name || "Overview"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted rounded-full border border-border">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">API Live</span>
            </div>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary text-[10px] font-black tracking-widest px-3">
              5/5 USES LEFT
            </Badge>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0A0A0A]">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
