"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  FolderHeart,
  LayoutDashboard,
  LogOut,
  Settings,
  Trophy,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const router = useRouter();

  async function handleSignOut(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/sign-in");
      router.refresh();
    } catch {
      router.push("/sign-in");
    }
  }

  return (
    <Sidebar variant="sidebar" className="border-r border-stone-200/80 bg-[#faf8f5]">
      <SidebarHeader className="p-4 border-b border-stone-200/60">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-display font-bold text-lg group-hover:scale-105 transition-transform">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-stone-900 font-display tracking-tight leading-none">
              Nook
            </span>
            <span className="text-[10px] text-stone-500 font-mono mt-0.5">
              Reading Corner
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider px-2 mb-1">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/dashboard" className="flex items-center gap-3 font-medium text-amber-700 bg-amber-500/10 rounded-xl px-3 py-2">
                      <LayoutDashboard className="w-4 h-4 text-amber-600" />
                      <span>Dashboard</span>
                    </Link>
                  }
                  isActive
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/dashboard" className="flex items-center gap-3 font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl px-3 py-2">
                      <BookOpen className="w-4 h-4 text-stone-500" />
                      <span>My Library</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/dashboard" className="flex items-center gap-3 font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl px-3 py-2">
                      <Bookmark className="w-4 h-4 text-stone-500" />
                      <span>Currently Reading</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/dashboard" className="flex items-center gap-3 font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl px-3 py-2">
                      <Trophy className="w-4 h-4 text-stone-500" />
                      <span>Reading Goals</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/dashboard" className="flex items-center gap-3 font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl px-3 py-2">
                      <FolderHeart className="w-4 h-4 text-stone-500" />
                      <span>Collections</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider px-2 mb-1">
            Preferences
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/dashboard" className="flex items-center gap-3 font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl px-3 py-2">
                      <Settings className="w-4 h-4 text-stone-500" />
                      <span>Settings</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-stone-200/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
              A
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-stone-900 truncate">
                Ada Lovelace
              </span>
              <span className="text-[10px] text-stone-500 truncate">
                ada@example.com
              </span>
            </div>
          </div>
          <form onSubmit={handleSignOut}>
            <button
              type="submit"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
