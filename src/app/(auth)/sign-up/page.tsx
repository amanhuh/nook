"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: SignUpInput) {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError("root", { message: result.error });
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("root", { message: "Something went wrong. Please try again." });
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-block mb-2 lg:hidden">
        <span className="text-2xl font-bold text-amber-500 font-display tracking-tight">
          Nook
        </span>
      </Link>

      <div className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
          Create your account
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-sans">
          Your reading life, beautifully organized
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-1">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-xs font-medium text-stone-700 pl-1 block"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            autoFocus
            placeholder="Ada Lovelace"
            {...register("name")}
            className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 pl-1 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-medium text-stone-700 pl-1 block"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            {...register("email")}
            className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 pl-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-xs font-medium text-stone-700 pl-1 block"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              {...register("password")}
              className="w-full h-11 pl-4 pr-12 rounded-xl bg-white border border-stone-200 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 p-1 hover:text-stone-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 pl-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account…
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-xs sm:text-sm text-stone-500 font-sans pt-1">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-amber-600 hover:text-amber-700 font-semibold underline-offset-4 hover:underline transition-all"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
