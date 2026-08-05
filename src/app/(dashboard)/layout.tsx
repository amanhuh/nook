import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-[#faf8f5]">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-stone-200/60 bg-[#faf8f5]/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="h-4 w-px bg-stone-200" />
            <h1 className="text-sm font-semibold text-stone-900 font-display">
              Dashboard
            </h1>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
