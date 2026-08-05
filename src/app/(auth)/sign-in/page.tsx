import Link from "next/link";
import { SignInForm } from "@/components/auth";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <Link href="/" className="inline-block mb-2 lg:hidden">
        <span className="text-2xl font-bold text-amber-500 font-display tracking-tight">
          Nook
        </span>
      </Link>

      <div className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-sans">
          Sign in to your reading corner
        </p>
      </div>

      <SignInForm />

      <p className="text-center text-xs sm:text-sm text-stone-500 font-sans pt-1">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-amber-600 hover:text-amber-700 font-semibold underline-offset-4 hover:underline transition-all"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
