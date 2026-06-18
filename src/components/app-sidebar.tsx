"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  MessageSquare,
  Mail,
  FileText,
  ListTodo,
  Search,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "AI Chatbot", url: "/chat", icon: MessageSquare },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", url: "/meeting", icon: FileText },
  { title: "Task Planner", url: "/tasks", icon: ListTodo },
  { title: "Research Assistant", url: "/research", icon: Search },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="gap-0">
        {/* Prominent Logo Area */}
        <div className="relative flex flex-col items-center px-3 pt-6 pb-5">
          {/* Animated glow ring behind logo */}
          <div className="logo-pulse absolute h-12 w-12 rounded-xl" />
          <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="mt-3 flex flex-col items-center text-center">
              <span className="text-base font-bold tracking-tight text-sidebar-foreground">
                AI Workplace
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
                Productivity
              </span>
            </div>
          )}
          {/* Decorative line */}
          {!collapsed && (
            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-sidebar-border to-transparent" />
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={collapsed ? item.title : undefined}
                      className={`
                        sidebar-item-hover group relative h-10 rounded-lg
                        ${active ? "sidebar-item-active" : "text-sidebar-foreground/70 hover:text-sidebar-foreground"}
                      `}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-3">
                        <item.icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span className="text-sm font-medium">{item.title}</span>
                        {active && (
                          <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white/80" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
