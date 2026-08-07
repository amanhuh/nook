"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { navItems } from "@/lib/config/nav";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type UserData = {
  id: string;
  name: string;
  email: string;
};

export function MobileNav() {
  const pathname = usePathname();
  const scrollDirection = useScrollDirection();
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
    <nav
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 md:hidden",
        "bg-background/90 backdrop-blur-md border-t border-border",
        "transition-transform duration-300 ease-in-out",
        scrollDirection === "down" ? "translate-y-full" : "translate-y-0"
      )}
    >
      <div className="flex items-center justify-around h-17 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 flex-1 h-full rounded-xl transition-colors",
                isActive ? "text-foreground" : "text-subtle hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6",
                  isActive && "scale-110 transition-transform"
                )}
              />
              <span className={cn("text-[11px] font-medium", isActive && "font-semibold")}>
                {item.title}
              </span>
            </Link>
          );
        })}

        <Popover>
          <PopoverTrigger
            render={
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-1.5 flex-1 h-full rounded-xl transition-colors text-subtle hover:text-foreground"
              >
                <UserCircle2 className="w-6 h-6" />
                <span className="text-[11px] font-medium">Profile</span>
              </button>
            }
          />
          <PopoverContent side="top" align="end" className="w-64 p-3 bg-card border-border">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">
                {initial}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  {user?.name || "Reading Corner"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email || ""}
                </span>
              </div>
            </div>
            <form onSubmit={handleSignOut} className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2.5 w-full h-10 px-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
                Sign out
              </button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
