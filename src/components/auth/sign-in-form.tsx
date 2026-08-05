"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { signInSchema, type SignInInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInInput) {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            setError(field as keyof SignInInput, {
              type: "server",
              message: message as string,
            });
          }
        }
        if (result.error && !result.fieldErrors) {
          setError("root", { message: result.error });
        }
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("root", { message: "Something went wrong. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-1">
      <Field data-invalid={!!errors.email} className="space-y-1.5">
        <FieldLabel
          htmlFor="email"
          className="text-xs font-medium text-muted-foreground pl-1 block"
        >
          Email
        </FieldLabel>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          {...register("email")}
          className="h-11 px-4 rounded-xl bg-card border-border text-foreground text-sm placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-foreground transition-all"
        />
        {errors.email && (
          <FieldError className="text-xs text-red-500 pl-1 font-medium">
            {errors.email.message}
          </FieldError>
        )}
      </Field>

      <Field data-invalid={!!errors.password} className="space-y-1.5">
        <FieldLabel
          htmlFor="password"
          className="text-xs font-medium text-muted-foreground pl-1 block"
        >
          Password
        </FieldLabel>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            className="h-11 pl-4 pr-12 rounded-xl bg-card border-border text-foreground text-sm placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-foreground transition-all"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground h-9 w-9"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <FieldError className="text-xs text-red-500 pl-1 font-medium">
            {errors.password.message}
          </FieldError>
        )}
      </Field>

      {errors.root && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
          {errors.root.message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-semibold text-sm transition-all shadow-md shadow-primary/20 cursor-pointer mt-2"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in…
          </span>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
