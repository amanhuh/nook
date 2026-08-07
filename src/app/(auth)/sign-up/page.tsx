import Link from "next/link";
import Image from "next/image";
import { SignUpForm } from "@/components/auth";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <Link href="/home" className="inline-flex items-center gap-2.5 mb-2">
        <Image
          src="/nook-logo.svg"
          alt="Nook logo"
          width={36}
          height={36}
          priority
          className="w-7 h-7 object-contain"
        />
        <span className="text-lg sm:text-xl font-bold text-foreground font-display tracking-tight">
          Nook
        </span>
      </Link>

      <div className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-sans">
          Your reading life, beautifully organized
        </p>
      </div>

      <SignUpForm />

      <p className="text-center text-xs sm:text-sm text-muted-foreground font-sans pt-1">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-foreground font-bold underline-offset-4 hover:underline transition-all"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
