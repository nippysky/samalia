// src/components/admin/login-form.tsx
// Client component — accepts pre-filled dev defaults from the server page.
// In production defaultEmail / defaultPassword arrive as empty strings.
"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/src/lib/validations";

interface LoginFormProps {
  defaultEmail?: string;
  defaultPassword?: string;
}

export function LoginForm({ defaultEmail = "", defaultPassword = "" }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
      password: defaultPassword,
    },
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm">
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1.5 font-medium"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="w-full bg-white border border-gray-200 text-gray-900 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors placeholder:text-gray-300"
          placeholder="admin@samalia.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1.5 font-medium"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="w-full bg-white border border-gray-200 text-gray-900 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors placeholder:text-gray-300"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1.5 text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 text-white py-3.5 text-[11px] tracking-[0.24em] uppercase font-medium transition-colors hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
