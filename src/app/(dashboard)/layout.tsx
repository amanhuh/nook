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
        <main className="flex-1 p-6 md:p-8 lg:p-10 w-full pb-24 md:pb-8">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
