import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
        <Image
          src="/nook-logo.svg"
          alt="Nook logo"
          width={28}
          height={28}
          priority
          className="w-7 h-7 object-contain transition-transform group-hover:-rotate-3"
        />
        <span className="text-lg font-bold text-foreground font-display tracking-tight">
          Nook
        </span>
      </Link>


      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground max-w-sm">
        Page not found
      </h1>

      <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
        This page doesn&apos;t exist or was moved. Let&apos;s get you back to your reading corner.
      </p>

      <div className="mt-8">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-muted hover:shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
