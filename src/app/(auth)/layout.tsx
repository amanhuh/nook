import { AuthHeroCovers } from "@/components/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground font-sans overflow-hidden">
      <AuthHeroCovers />

      <div className="flex-1 lg:w-[55%] h-screen flex items-center justify-center p-8 sm:p-12 lg:p-16 overflow-y-auto bg-background">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
