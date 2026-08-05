"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/config/nav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type UserData = {
  id: string;
  name: string;
  email: string;
};

function NavButton({
  item,
  isActive,
}: {
  item: { title: string; href: string; icon: React.ElementType };
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={item.href}
            className={cn(
              "flex items-center justify-center lg:justify-start gap-4 w-12 h-12 lg:w-full lg:h-14 px-0 lg:px-4 rounded-2xl font-semibold text-base transition-all",
              isActive
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6 shrink-0",
                isActive ? "text-foreground" : "text-subtle"
              )}
            />
            <span className="hidden lg:block">{item.title}</span>
          </Link>
        }
      />
      <TooltipContent side="right" className="lg:hidden">
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {}
    }
    fetchUser();
  }, []);

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

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "N";

  return (
    <TooltipProvider delay={200}>
      <aside className="hidden md:flex flex-col h-svh w-16 lg:w-64 shrink-0 border-r border-border bg-background sticky top-0">
        <div className="flex items-center justify-center lg:justify-start h-16 px-3 border-b border-border shrink-0">
          <Link href="/home" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              N
            </div>
            <div className="hidden lg:flex flex-col min-w-0">
              <span className="text-base font-bold text-foreground font-display tracking-tight leading-none">
                Nook
              </span>
              <span className="text-[10px] text-subtle font-mono mt-0.5">
                Reading Corner
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col flex-1 justify-start gap-1 px-2 py-4">
          {navItems.map((item) => (
            <NavButton
              key={item.href}
              item={item}
              isActive={
                pathname === item.href ||
                pathname.startsWith(item.href + "/")
              }
            />
          ))}
        </nav>

        <div className="p-2 border-t border-border shrink-0">
          <div className="flex items-center justify-center lg:justify-between gap-2.5 p-2 rounded-xl bg-card border border-border shadow-xs">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs shrink-0">
              {initial}
            </div>
            <div className="hidden lg:flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate">
                {user?.name || "Reading Corner"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user?.email || ""}
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger
                render={
                  <form onSubmit={handleSignOut} className="hidden lg:block">
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-muted transition-colors shrink-0"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </form>
                }
              />
              <TooltipContent side="right">Sign out</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
