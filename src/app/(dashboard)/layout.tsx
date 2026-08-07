import Link from "next/link";
import Image from "next/image";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh bg-white">
      <AppSidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background/90 backdrop-blur-md z-30">
          <Link href="/home" className="flex items-center gap-2">
            <Image
              src="/nook-logo.svg"
              alt="Nook Logo"
              width={32}
              height={32}
              priority
              className="w-6 h-6 object-contain"
            />
            <span className="text-lg font-bold font-display text-foreground tracking-tight">
              Nook
            </span>
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full pb-24 md:pb-8">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
